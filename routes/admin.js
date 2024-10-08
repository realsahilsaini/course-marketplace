const { Router } = require("express");
const { AdminModel } = require("../db/db");
const { CourseModel } = require("../db/db");
const { adminAuth } = require("../auth/adminAuth");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

    const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

    const newAdmin = new AdminModel({
      email: validatedBody.email,
      username: validatedBody.username,
      password: hashedPassword,
      firstName: validatedBody.firstName,
      lastName: validatedBody.lastName,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
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

  const passwordMatch = await bcrypt.compare(password, existingAdmin.password);

  if (!passwordMatch) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }



  const token = jwt.sign(
    { adminId: existingAdmin._id.toString() },
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

    const newCourse = new CourseModel({
      title: newCourseDetails.title,
      description: newCourseDetails.description,
      creatorId: req.decodedAdminID,
    });
    
    await newCourse.save();

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
adminRouter.delete("/course/delete/:id", adminAuth, async (req, res) => {
  try{ 

    const courseToDelete = await CourseModel.findById(req.params.id);

    if(!courseToDelete){
      return res.status(400).json({
        message: "Course not found",
      });
    }

    if (courseToDelete.creatorId.toString() !== req.decodedAdminID.toString()) {
      return res.status(401).json({
        message: "You can't delete other admin's course",
      });
    }

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

    const courseToUpdate = await CourseModel.findById(courseID);

    if(!courseToUpdate){
      return res.status(400).json({
        message: "Course not found",
      });
    }


    if (courseToUpdate.creatorId.toString() !== req.decodedAdminID.toString()) {
      return res.status(401).json({
        message: "You can't edit other admin's course",
      });
    }


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
