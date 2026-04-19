const lpModel = require("../models/lpModel");

const getLandingPage = async (siteKey = "main", variant = "default") => {
  return await lpModel.getAllData(siteKey, variant);
};

const updateLandingPage = async (sectionName, newData, siteKey = "main", variant = "default") => {
  const updatedData = await lpModel.updateSection(sectionName, newData, siteKey, variant);
  if (!updatedData) {
    throw new Error("Lỗi khi cập nhật Section");
  }
  return updatedData;
};

module.exports = { getLandingPage, updateLandingPage };
