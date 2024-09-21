const {Router} = require('express');
const {AdminModel} = require('../db/db');
const { authMiddleware } = require('../auth/auth');
const adminRouter = Router();


/*
Add routes for admin login, admin signup, create a course, delete a course, add course content.
*/

//Admin signup route
adminRouter.post('/signup', async (req, res) => {
  const {email, username, password, firstName, lastName} = req.body;

  try{

      const existingAdmin = await AdminModel.findOne({ username });

      if(existingAdmin){
          return res.status(400).json({
              message: "Admin already exists"
          })
      }

       await AdminModel.create({
          email,
          username,
          password,
          firstName,
          lastName
      });

      res.status(201).json({ message: "Signup successful" });
  }catch(err){
      console.log("Error finding admin", err);
      res.status(500).json({
          message: "Internal server error"
      })
  }

});

//Admin signin route
adminRouter.post('/signin', async (req, res) => {
  const {username, password} = req.body;

  const existingAdmin = await AdminModel.findOne({ username });

  if(!existingAdmin){
      return res.status(400).json({
          message: "Admin does not exist"
      })
  }

  if(existingAdmin.password !== password){
      return res.status(400).json({
          message: "Invalid password"
      })
  }

  res.status(200).json({
      message: "Signin successful"
  })
});

//View all courses route
adminRouter.get('/courses', authMiddleware, (req, res) => {
  res.json({message: "View all courses"});
});

//Create course route
adminRouter.post('/course/create', authMiddleware, (req, res) => {
  res.json({message: "Create course"});
}); 

//Delete course route
adminRouter.delete('/course/delete', authMiddleware, (req, res) => {
  res.send("Delete course");
});

//Edit course content route
adminRouter.put('/course/content/add', authMiddleware, (req, res) => {
  res.json({message: "Add course content"});
});

module.exports = {
  adminRouter: adminRouter
};