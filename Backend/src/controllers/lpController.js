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
      const activePrizes = await Prize.find({ isActive: true }).sort({ order: 1 });
      
      // Chuyển Mongoose Document sang Object để loại bỏ _id nếu muốn, 
      // nhưng cứ gán trực tiếp cũng được.
      data.luckyspin.prizes = activePrizes.map(p => ({
        option: p.option,
        code: p.code,
        backgroundColor: p.backgroundColor,
        textColor: p.textColor,
        id: p._id // Gửi kèm ID để frontend tiện map key
      }));
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
