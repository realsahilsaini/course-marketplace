const mongoose = require('mongoose');

//Connect to database 
async function connectDB(envDBLink){
  try{
    await mongoose.connect(envDBLink);
    console.log("\nDatabase connected successfully");
  }catch(err){
    console.log("\nError connecting to database", err);
    process.exit(1);
  }
}


module.exports = connectDB;