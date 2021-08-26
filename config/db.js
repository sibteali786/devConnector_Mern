const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

// For conecting to monodb data base
// mongoose.connect(db)        // returns a proise so must be used with either then or await

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDb connected....");
  } catch (error) {
    console.log(err.message);
    //Exit process with Failure
    process.exit(1);
  }
};

module.exports = connectDB;
