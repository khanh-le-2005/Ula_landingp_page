const { Lead } = require("../models/leadModel");

const createLead = async (leadData) => {
  const newLead = new Lead(leadData);
  return await newLead.save();
};

const getAllLeads = async () => {
  return await Lead.find().sort({ createdAt: -1 });
};

module.exports = {
  createLead,
  getAllLeads,
};
