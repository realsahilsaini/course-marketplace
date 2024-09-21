const express = require('express');
const app = express();

const jwt = require("jsonwebtoken");
const JWT_SECRET = "mysecret";

app.use(express.json());

/*
Add route skeleton for user login, signup, purchase a course, see course
 */

//Signup route
app.post('/signup', (req, res) => {});

//Signin route
app.post('/signin', (req, res) => {});

//See course route
app.get('/courses', (req, res) => {});

//Purchase course route
app.get('/my-purchases', (req, res) => {});

//Puchase a course route
app.post('/course/purchase', (req, res) => {});




app.listen(3000, () => {
  "Server is running on http://localhost:3000"
});

