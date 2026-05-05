const { Campaign } = require("../models/campaignModel");
const { Image } = require("../models/imageModel");
const imageService = require("../services/imageService");
const { unflatten, getNestedValue, deepMergePreserveImages } = require("../utils/objectUtil");

const getFullUrl = (req, siteKey, tag) => {
  const protocol = req.protocol === "http" && req.get("host").includes("localhost") ? "http" : "https";
  const host = req.get("host");
  const siteMap = { "tieng-duc": "/german", "tieng-trung": "/chinese", "main": "" };
  const path = siteMap[siteKey] || "";
  return `${protocol}://${host}${path}?campaign=${tag}`;
};

// Lấy tất cả chiến dịch (Admin) theo trang đang chọn
const getCampaigns = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const campaigns = await Campaign.find({ siteKey }).sort({ createdAt: -1 });

    // Thêm Link vào kết quả trả về
    const enhancedCampaigns = campaigns.map(c => ({
      ...c.toObject(),
      fullUrl: getFullUrl(req, siteKey, c.tag)
    }));

    res.status(200).json(enhancedCampaigns);
  } catch (err) {
    next(err);
  }
};

// Lấy 1 chiến dịch theo Tag (dùng cho Frontend resolve)
const getCampaignByTag = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const campaign = await Campaign.findOne({
      tag: req.params.tag,
      siteKey,
      isActive: true
    });
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    res.status(200).json(campaign);
  } catch (err) {
    next(err);
  }
};

// Tạo chiến dịch mới (Admin)
const createCampaign = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    let rawBody = req.body || {};

    // --- Xử lý file ảnh được upload lên (nếu có) ---
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Upload buffer to GridFS
        const gridfsId = await imageService.uploadToGridFS(file);

        const newImage = new Image({
          filename: file.filename || file.originalname,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: "",
          gridfsId: gridfsId
        });
        await newImage.save();
        // Lưu đường dẫn ảnh tương đối vào body
        rawBody[file.fieldname] = `/api/images/${newImage._id.toString()}`;
      }
    }

    const body = unflatten(rawBody); // Xử lý lồng ghép JSON/FormData

    console.log("[DEBUG CAMPAIGN CREATE] rawBody:", JSON.stringify(rawBody));
    console.log("[DEBUG CAMPAIGN CREATE] unflatten(rawBody):", JSON.stringify(body));

    // Chuẩn hóa: Nếu Frontend gửi mảng [{sectionKey, content}] thay vì Object
    if (Array.isArray(body.sections)) {
      const normalizedSections = {};
      body.sections.forEach(s => {
        if (s.sectionKey) normalizedSections[s.sectionKey] = s.content || {};
      });
      body.sections = normalizedSections;
    }

    // --- Tự động đồng bộ Prizes từ section luckyspin ra ngoài bảng chính ---
    const luckyspin = body.sections?.luckyspin || body.sections?.section_5_lucky_wheel;
    if (luckyspin && luckyspin.prizes) {
      body.prizes = luckyspin.prizes.map((p, index) => ({
        ...p,
        order: p.order || index
      }));
    }

    // --- Kiểm tra trùng Tag trước khi tạo ---
    const existingCampaign = await Campaign.findOne({ tag: body.tag, siteKey });
    if (existingCampaign) {
      return res.status(400).json({ 
        success: false, 
        message: `Mã Tag "${body.tag}" đã tồn tại trên trang này. Vui lòng dùng mã khác hoặc cập nhật Tag cũ.` 
      });
    }

    const data = { ...body, siteKey };
    const campaign = new Campaign(data);
    await campaign.save();
    res.status(201).json({
      message: "Tạo chiến dịch thành công",
      data: { ...campaign.toObject(), fullUrl: getFullUrl(req, siteKey, campaign.tag) }
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật chiến dịch (Admin)
const updateCampaign = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    let rawBody = req.body || {};

    const existingCampaign = await Campaign.findOne({ _id: req.params.id, siteKey });
    if (!existingCampaign) {
      return res.status(404).json({ message: "Không tìm thấy chiến dịch hoặc bạn không có quyền sửa" });
    }

    // --- Xử lý file ảnh được upload lên + Cleanup ảnh cũ ---
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // 1. Lấy URL ảnh cũ (Vd: sections.hero.heroImageUrl -> bóc tách từ existingCampaign.sections)
        // Lưu ý: fieldname từ multer có thể là 'sections.hero.heroImageUrl' hoặc 'sections[0][content][heroImageUrl]'
        // Ta cần normalize path để dùng với getNestedValue
        const normalizedPath = file.fieldname.replace(/\[(\d+)\]/g, '.$1').replace(/^sections\./, '');
        const oldImageUrl = getNestedValue(existingCampaign.sections, normalizedPath);

        if (oldImageUrl && typeof oldImageUrl === 'string' && oldImageUrl.includes('/api/images/')) {
          const oldImageId = oldImageUrl.split('/').pop();
          if (oldImageId && oldImageId.length === 24) {
            console.log(`[CAMPAIGN CLEANUP] Deleting legacy image: ${oldImageId} from path: ${normalizedPath}`);
            await imageService.handleDeleteImage(oldImageId);
          }
        }

        // 2. Lưu ảnh mới
        // Upload buffer to GridFS
        const gridfsId = await imageService.uploadToGridFS(file);

        const newImage = new Image({
          filename: file.filename || file.originalname,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: "",
          gridfsId: gridfsId
        });
        await newImage.save();
        rawBody[file.fieldname] = `/api/images/${newImage._id.toString()}`;
      }
    }

    const body = unflatten(rawBody);

    // Chuẩn hóa tương tự như Create (nếu chuyển từ Array sang Object)
    if (Array.isArray(body.sections)) {
      const normalizedSections = {};
      body.sections.forEach(s => {
        if (s.sectionKey) normalizedSections[s.sectionKey] = s.content || {};
      });
      body.sections = normalizedSections;
    }

    // --- Tự động đồng bộ Prizes tương tự Create ---
    const luckyspin = body.sections?.luckyspin || body.sections?.section_5_lucky_wheel;
    if (luckyspin && luckyspin.prizes) {
      body.prizes = luckyspin.prizes.map((p, index) => ({
        ...p,
        order: p.order || index
      }));
    }

    // MERGE: Kết hợp body mới với data cũ để bảo vệ ảnh không bị ghi đè rỗng
    const existingObj = existingCampaign.toObject();
    const safeBody = deepMergePreserveImages(existingObj, body);

    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, siteKey },
      safeBody,
      { new: true, runValidators: true }
    );
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch hoặc bạn không có quyền sửa" });
    res.status(200).json({
      message: "Cập nhật thành công",
      data: { ...campaign.toObject(), fullUrl: getFullUrl(req, siteKey, campaign.tag) }
    });
  } catch (err) {
    next(err);
  }
};

// Xóa chiến dịch (Admin)
const deleteCampaign = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, siteKey });
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    next(err);
  }
};

/**
 * Công cụ tạo Link Marketing hoàn chỉnh
 * POST /api/campaigns/generate-link
 */
const generateMarketingLink = async (req, res, next) => {
  try {
    const { tag, ref, utm_source, utm_medium, utm_campaign, utm_content } = req.body;
    const siteKey = req.siteKey;

    let baseUrl = getFullUrl(req, siteKey, tag || "default");

    // Nếu tag là default (trang gốc), ta xóa cái ?campaign= đi để link đẹp
    if (!tag) {
      baseUrl = baseUrl.split("?")[0];
    }

    const url = new URL(baseUrl);

    if (ref) url.searchParams.set("ref", ref);
    if (utm_source) url.searchParams.set("utm_source", utm_source);
    if (utm_medium) url.searchParams.set("utm_medium", utm_medium);
    if (utm_campaign) url.searchParams.set("utm_campaign", utm_campaign);
    if (utm_content) url.searchParams.set("utm_content", utm_content);

    res.status(200).json({
      siteKey,
      fullUrl: url.toString()
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCampaigns,
  getCampaignByTag,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  generateMarketingLink
};
