const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const collection = mongoose.connection.collection("landingpages");
    
    console.log("Checking indexes...");
    const indexes = await collection.indexes();
    console.log("Current indexes:", JSON.stringify(indexes, null, 2));

    // Tìm xem có index unique trên sectionKey không
    const hasOldIndex = indexes.find(idx => idx.name === "sectionKey_1");
    if (hasOldIndex) {
      console.log("Dropping old unique index: sectionKey_1");
      await collection.dropIndex("sectionKey_1");
      console.log("✅ Dropped successfully.");
    } else {
      console.log("No old index found.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error fixing indexes:", error);
    process.exit(1);
  }
};

fixIndexes();
