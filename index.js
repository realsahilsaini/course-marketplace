const express = require('express');
const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/course');
const {adminRouter} = require('./routes/admin');
const connectDB = require('./connectDB');
const mongoose = require('mongoose');
require("dotenv").config();
const app = express();
app.use(express.json());


connectDB(process.env.MONGO_URI);


app.use('/api/v1/user', userRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/admin', adminRouter);



app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

