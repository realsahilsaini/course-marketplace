const { Router } = require("express");
const { AdminModel } = require("../db/db");
const { CourseModel } = require("../db/db");
const { adminAuth } = require("../auth/adminAuth");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const { z } = require("zod");

//Input validation schema
const requiredBodySignup = z.object({
  email: z.string().email("Invalid email format"),

  username: z.string(),
  // .min(3, "Username must be at least 3 characters long")
  // .max(20, "Username cannot exceed 20 characters")
  // .regex(
  //   /^[a-zA-Z0-9]+$/,
  //   "Username can only contain alphanumeric characters"
  // )
  password: z.string(),
  // .min(8, "Password must be at least 8 characters long")
  // .max(64, "Password cannot exceed 64 characters")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[\W_]/, "Password must contain at least one special character")
  firstName: z.string().min(1, "First name cannot be empty"),

  lastName: z.string().min(1, "Last name cannot be empty"),
});

//Admin signup route
adminRouter.post("/signup", async (req, res) => {
  const validatedBody = requiredBodySignup.parse(req.body);

  try {
    const existingAdmin = await AdminModel.findOne({
      username: validatedBody.username,
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const newAdmin = new AdminModel(validatedBody);

    await newAdmin.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.log("Error finding admin", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

//Admin signin route
adminRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const existingAdmin = await AdminModel.findOne({ username });

  if (!existingAdmin) {
    return res.status(400).json({
      message: "Admin does not exist",
    });
  }

  if (existingAdmin.password !== password) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    { username: existingAdmin.username },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    message: "Signin successful",
    token: token,
  });
});

//View all courses route
adminRouter.get("/courses", adminAuth, async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.send(courses);
  } catch (err) {
    console.log("Error finding courses", err);
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

//Create course route
adminRouter.post("/course/create", adminAuth, async (req, res) => {

  try{

    const newCourseDetails = req.body;

    const existingCourseTitle = await CourseModel.findOne({
      title: newCourseDetails.title,
      });


    if(existingCourseTitle){
      return res.status(400).json({
        message: "Course with this title already exists",
      });
    }

    const newCourse = new CourseModel(newCourseDetails);
    newCourse.save();

    res.status(201).json({
      message: "Course created successfully",
    });

  }catch(err){
    console.log("Error creating course", err);
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }

});

//Delete course route
adminRouter.delete("/course/:id", adminAuth, async (req, res) => {
  try{ 

    await CourseModel.findByIdAndDelete(req.params.id);
    res.json({
      message: "Course deleted successfully",
    });

  }catch(err){

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });

  }
});

//Edit course content route
adminRouter.put("/course/edit/:id", adminAuth, async (req, res) => {
  try{

    const courseID = req.params.id;
    const updatedCourseContent = req.body;

    const updateCourse = await CourseModel.findByIdAndUpdate(
      courseID,
      updatedCourseContent,
      { new: true }
    );

    if(!updateCourse){
      return res.status(400).json({
        message: "Course not found",
      });
    }

    res.json({
      message: "Course updated successfully",
      courses: updateCourse,
    });

  }catch(err){

    res.status(500).json({
      message: "Internal server error",
      error: err,
    });

  }
});

module.exports = {
  adminRouter: adminRouter,
};
