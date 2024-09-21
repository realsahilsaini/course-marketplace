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


/*
Add routes for admin login, admin signup, create a course, delete a course, add course content.
*/

//Admin signup route
app.post('/admin/signup', (req, res) => {});

//Admin signin route
app.post('/admin/signin', (req, res) => {});

//Create course route
app.post('/admin/course/create', (req, res) => {}); 

//Delete course route
app.delete('/admin/course/delete', (req, res) => {});

//Add course content route
app.post('/admin/course/content/add', (req, res) => {});



app.listen(3000, () => {
  "Server is running on http://localhost:3000"
});

