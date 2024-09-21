const express = require('express');
const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/course');
const {adminRouter} = require('./routes/admin');
const mongoose = require('mongoose');
require("dotenv").config();


//Connect to database 
async function connectDB(){
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  }catch(err){
    console.log("Error connecting to database", err);
    process.exit(1);
  }
}
connectDB();


const app = express();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/admin', adminRouter);



app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

