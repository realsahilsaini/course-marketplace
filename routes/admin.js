const {Router} = require('express');
const adminRouter = Router();


/*
Add routes for admin login, admin signup, create a course, delete a course, add course content.
*/

//Admin signup route
adminRouter.post('/signup', (req, res) => {
  res.send("Admin signup");
});

//Admin signin route
adminRouter.post('/signin', (req, res) => {
  res.send("Admin signin");
});

//Create course route
adminRouter.post('/course/create', (req, res) => {
  res.send("Create course");
}); 

//Delete course route
adminRouter.delete('/course/delete', (req, res) => {
  res.send("Delete course");
});

//Add course content route
adminRouter.post('/course/content/add', (req, res) => {
  res.send("Add course content");
});

module.exports = {
  adminRouter: adminRouter
};