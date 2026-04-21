const lpService = require("../services/lpService");
const { Image } = require("../models/imageModel");
const imageService = require("../services/imageService");
const lpModel = require("../models/lpModel");
const { unflatten } = require("../utils/objectUtil");

/**
 * Helper để lấy siteKey từ hostname hoặc query
 * Hostname: koc-an.ula.edu.vn -> siteKey: koc-an
 * Hostname: localhost, 127.0.0.1, ula.edu.vn -> siteKey: main
 */
const getSiteKey = (req) => {
  if (req.query.site) return req.query.site;
  
  const host = req.headers.host || "";
  if (host.includes("localhost") || host.includes("127.0.0.1") || host.split(".").length <= 2) {
    return "main";
  }
  
  return host.split(".")[0];
};

const getLP = async (req, res) => {
  try {
    const siteKey = getSiteKey(req);
    const variant = req.query.variant || "default";
    const data = await lpService.getLandingPage(siteKey, variant);

    // Dynamic Prizes Injection: 
    // Ghi đè mảng prizes tĩnh bằng dữ liệu thực tế từ collection Prizes
    if (data && data.luckyspin) {
      const { Prize } = require("../models/prizeModel");
      const prizeFilter = { isActive: true };
      if (req.query.prize_tag) {
        prizeFilter.tags = req.query.prize_tag; // Lọc theo nhãn nếu có trên URL
      }
      const activePrizes = await Prize.find(prizeFilter).sort({ order: 1 });
      
      // Chuyển Mongoose Document sang Object để loại bỏ _id nếu muốn, 
      // nhưng cứ gán trực tiếp cũng được.
      data.luckyspin.prizes = activePrizes.map(p => ({
        option: p.option,
        code: p.code,
        backgroundColor: p.backgroundColor,
        textColor: p.textColor,
        probability: p.probability,
        id: p._id // Gửi kèm ID để frontend tiện map key
      }));
    }

    // --- CAMPAIGN OVERLAY RESOLVER ---
    // Nếu URL có ?campaign=TAG, lấy chiến dịch và ghi đè lên dữ liệu bản gốc.
    if (req.query.campaign) {
      const { Campaign } = require("../models/campaignModel");
      const campaign = await Campaign.findOne({ tag: req.query.campaign, isActive: true });

      if (campaign) {
        // 1. Merge từng section từ Campaign lên base data.
        // Campaign.sections format: { "section_1_hero": {...}, "section_3_solution": [...] }
        // Chỉ ghi đè những section có trong Campaign, giữ nguyên phần còn lại.
        if (campaign.sections && campaign.sections.size > 0) {
          const sectionOverrides = campaign.sections instanceof Map
            ? Object.fromEntries(campaign.sections)
            : campaign.sections;

          for (const [sectionKey, sectionData] of Object.entries(sectionOverrides)) {
            if (Array.isArray(sectionData)) {
              // Array section (e.g. section_3_solution): thay thế hoàn toàn
              data[sectionKey] = sectionData;
            } else if (sectionData && typeof sectionData === "object") {
              // Object section (e.g. section_1_hero): merge field-by-field
              data[sectionKey] = { ...(data[sectionKey] || {}), ...sectionData };
            }
          }
        }

        // 2. Ưu tiên 1: Quà nhúng thẳng vào Campaign.prizes[]
        if (campaign.prizes && campaign.prizes.length > 0) {
          const spinKey = Object.keys(data).find(k => k.includes("lucky") || k.includes("spin") || k.includes("wheel"));
          if (spinKey && data[spinKey]) {
            data[spinKey].prizes = campaign.prizes
              .sort((a, b) => a.order - b.order)
              .map(p => ({ option: p.option, code: p.code, backgroundColor: p.backgroundColor, textColor: p.textColor, probability: p.probability }));
          }
        }
        // Ưu tiên 2: Lọc quà theo prizeTag
        else if (campaign.prizeTag) {
          const { Prize } = require("../models/prizeModel");
          const campaignPrizes = await Prize.find({ isActive: true, tags: campaign.prizeTag }).sort({ order: 1 });
          const spinKey = Object.keys(data).find(k => k.includes("lucky") || k.includes("spin") || k.includes("wheel"));
          if (spinKey && data[spinKey]) {
            data[spinKey].prizes = campaignPrizes.map(p => ({ option: p.option, code: p.code, backgroundColor: p.backgroundColor, textColor: p.textColor, probability: p.probability }));
          }
        }

        console.log(`[CAMPAIGN] Áp dụng chiến dịch: "${campaign.name}" (tag: ${campaign.tag})`);
      }
    }

    // --- Requirement 2: Nội dung động (URL Dynamic Content, ưu tiên thấp hơn Campaign) ---
    if (data && data.hero) {
      if (req.query.headline) data.hero.headlineTop = req.query.headline;
      if (req.query.badge) data.hero.badge = req.query.badge;
      if (req.query.subheadline) data.hero.subHeadline = req.query.subheadline;
      if (req.query.city) data.hero.headlineTop = `Ưu đãi tại ${req.query.city}`;
    }

    if (data && data.luckyspin) {
      if (req.query.spin_headline) data.luckyspin.headline = req.query.spin_headline;
      if (req.query.spin_description) data.luckyspin.description = req.query.spin_description;
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLP = async (req, res) => {
  try {
    const sectionName = req.params.section;
    const siteKey = getSiteKey(req);
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

    res.status(200).json({ message: "Cập nhật thành công", data: updatedData, siteKey, variant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getLP, updateLP };
