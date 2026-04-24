const lpService = require("../services/lpService");
const { Image } = require("../models/imageModel");
const imageService = require("../services/imageService");
const lpModel = require("../models/lpModel");
const { unflatten } = require("../utils/objectUtil");

const getLP = async (req, res, next) => {
  try {
    const siteKey = req.siteKey; // Lấy từ siteMiddleware
    const variant = req.query.variant || "default";
    const data = await lpService.getLandingPage(siteKey, variant);

    if (!data) return res.status(404).json({ message: "Không tìm thấy dữ liệu trang." });

    // Dynamic Prizes Injection: 
    const spinKey = Object.keys(data).find(k => k.includes("lucky") || k.includes("spin") || k.includes("wheel"));
    
    if (spinKey && data[spinKey]) {
      const { Prize } = require("../models/prizeModel");
      const prizeFilter = { isActive: true, siteKey }; // Lọc quà của riêng trang đó
      if (req.query.prize_tag) {
        prizeFilter.tags = req.query.prize_tag;
      }
      const activePrizes = await Prize.find(prizeFilter).sort({ order: 1 });

      data[spinKey].prizes = activePrizes.map(p => ({
        option: p.option,
        code: p.code,
        backgroundColor: p.backgroundColor,
        textColor: p.textColor,
        probability: p.probability,
        id: p._id
      }));
    }

    // --- CAMPAIGN OVERLAY RESOLVER ---
    if (req.query.campaign) {
      const { Campaign } = require("../models/campaignModel");
      // Tìm campaign thuộc đúng Site hiện tại
      const campaign = await Campaign.findOne({
        tag: req.query.campaign,
        siteKey,
        isActive: true
      });

      if (campaign) {
        if (campaign.sections) {
          const sectionOverrides = campaign.sections;
          
          // Mapping bảng ánh xạ key (từ Logical sang Physical)
          const keyMap = {
            'hero': 'section_1_hero',
            'painpoints': 'section_2_painpoints',
            'solution': 'section_3_solution',
            'methodology': 'section_4_methodology',
            'luckyspin': 'section_5_lucky_wheel',
            'luckyWheel': 'section_5_lucky_wheel'
          };

          for (const [sectionKey, sectionData] of Object.entries(sectionOverrides)) {
            // Xác định key thực sự trong DB
            const physicalKey = keyMap[sectionKey] || sectionKey;

            if (Array.isArray(sectionData)) {
              data[physicalKey] = sectionData;
            } else if (sectionData && typeof sectionData === "object") {
              // Merge nội dung nếu là object, ghi đè nếu là key mới
              data[physicalKey] = { ...(data[physicalKey] || {}), ...sectionData };
            }
          }
        }

        if (campaign.prizes && campaign.prizes.length > 0) {
          if (spinKey && data[spinKey]) {
            data[spinKey].prizes = campaign.prizes
              .sort((a, b) => a.order - b.order)
              .map(p => ({ option: p.option, code: p.code, backgroundColor: p.backgroundColor, textColor: p.textColor, probability: p.probability }));
          }
        }
        else if (campaign.prizeTag) {
          const { Prize } = require("../models/prizeModel");
          const campaignPrizes = await Prize.find({ isActive: true, siteKey, tags: campaign.prizeTag }).sort({ order: 1 });
          if (spinKey && data[spinKey]) {
            data[spinKey].prizes = campaignPrizes.map(p => ({ option: p.option, code: p.code, backgroundColor: p.backgroundColor, textColor: p.textColor, probability: p.probability }));
          }
        }

        console.log(`[CAMPAIGN] [${siteKey}] Áp dụng: "${campaign.name}"`);
      }
    }

    if (data.hero) {
      if (req.query.headline) data.hero.headlineTop = req.query.headline;
      if (req.query.badge) data.hero.badge = req.query.badge;
      if (req.query.subheadline) data.hero.subHeadline = req.query.subheadline;
      if (req.query.city) data.hero.headlineTop = `Ưu đãi tại ${req.query.city}`;
    }

    if (spinKey && data[spinKey]) {
      if (req.query.spin_headline) data[spinKey].headline = req.query.spin_headline;
      if (req.query.spin_description) data[spinKey].description = req.query.spin_description;
    }

    res.status(200).json(data);

  } catch (error) {
    next(error);
  }
};

const updateLP = async (req, res, next) => {
  try {
    const sectionName = req.params.section;
    const siteKey = req.siteKey; // Lấy từ siteMiddleware
    const variant = req.query.variant || "default";
    let rawData = req.body || {};

    const allData = await lpModel.getAllData(siteKey, variant);
    const existingContent = allData[sectionName] || {};

    const newData = unflatten(rawData);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const oldImageId = existingContent[file.fieldname];
        if (oldImageId) {
          await imageService.handleDeleteImage(oldImageId);
        }

        const newImage = new Image({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        });
        await newImage.save();

        rawData[file.fieldname] = newImage._id.toString();
      }
    }

    const finalData = unflatten(rawData);
    const updatedData = await lpService.updateLandingPage(sectionName, finalData, siteKey, variant);

    // --- PRIZE SYNCHRONIZATION LOGIC ---
    // Nếu đây là section vòng quay và có gửi kèm danh sách prizes, ta đồng bộ vào bảng Prize gốc
    const isSpinSection = sectionName.includes("lucky") || sectionName.includes("spin") || sectionName.includes("wheel");
    if (isSpinSection && finalData.prizes && Array.isArray(finalData.prizes)) {
      const { Prize } = require("../models/prizeModel");
      
      // 1. Xóa quà cũ của Site này (để ghi đè bản mới từ Editor)
      await Prize.deleteMany({ siteKey });

      // 2. Insert bộ quà mới
      const prizesToInsert = finalData.prizes.map((p, index) => ({
        option: p.option || "Phần thưởng",
        code: p.code || `ULA-AUTO-${Date.now()}-${index}`,
        backgroundColor: p.backgroundColor || "#2563eb",
        textColor: p.textColor || "white",
        probability: Number(p.probability) || 1,
        order: index,
        siteKey: siteKey,
        isActive: true
      }));

      if (prizesToInsert.length > 0) {
        await Prize.insertMany(prizesToInsert);
        console.log(`[SYNC] [${siteKey}] Đã đồng bộ ${prizesToInsert.length} giải thưởng từ Editor vào bảng Prize.`);
      }
    }

    res.status(200).json({ message: "Cập nhật thành công", data: updatedData, siteKey, variant });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLP, updateLP };
