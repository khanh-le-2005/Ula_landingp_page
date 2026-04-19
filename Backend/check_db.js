const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { LandingPage } = require("./src/models/lpModel");

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await LandingPage.countDocuments();
    const samples = await LandingPage.find().limit(3);
    
    console.log(`Total records: ${count}`);
    console.log("Samples:", JSON.stringify(samples, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkData();
