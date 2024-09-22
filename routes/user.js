const { UserModel, PurchaseModel, CourseModel } = require("../db/db");
const { Router } = require("express");
const { userAuth } = require("../auth/userAuth");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const userRouter = Router();

//Input validation schema
const requiredBodySignup = z.object({
  email: z.string().email("Invalid email format"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain alphanumeric characters"
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot exceed 64 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),

    firstName: z.string().min(1, "First name cannot be empty"),

    lastName: z.string().min(1, "Last name cannot be empty"),
});

//User signup route 
userRouter.post("/signup", async function (req, res) {
  try {
    const validatedBody = requiredBody.parse(req.body);

    const existingUserWithUsername = await UserModel.findOne({
      username: validatedBody.username,
    });

    const existingUserWithEmail = await UserModel.findOne({
      email: validatedBody.email, 
    });

    if (existingUserWithEmail || existingUserWithUsername) {
      return res.status(400).json({
        message: "User already exists with this email or username",
      });
    }

    const newUser = new UserModel(validatedBody);
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    //handel error from zod
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.errors[0],
      });
    }

    //handel other errors
    res.status(500).json({ 
        message: "Internal server error" ,
        error: err.message
    });
  }
});

//User signin route
userRouter.post("/signin", async function (req, res) {
  try {

    const { username, password } = req.body;

    const user = await UserModel.findOne({ 
        username: username,
    });

    if (!user || user.password !== password) {
      return res.status(404).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign({ userID: user._id}, process.env.JWT_SECRET);

    res.json({
      token: token,
      message: "Signin successful",
    });
  } catch (err) {
    //handel error from zod
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.errors[0].message,
      });
    }

    //handel other errors
    res.status(500).json({ 
        message: "Internal server error" 
    });
  }

});

//purchase course route
userRouter.post("/purchase", userAuth, async function (req, res) {
  
  try{
    //Checks if the course exists in the database
    const courseId = req.body.courseId;
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    //checks if the user has already purchased the course
    const existingPurchase = await PurchaseModel.findOne({ 
      userId: req.decodedUserID, 
      courseId: course._id,
    });

    if (existingPurchase) {
      return res.status(400).json({
        message: "Course already purchased",
      });
    }


    //Creates a new purchase
    const newPurchase  = new PurchaseModel({
      userId: req.decodedUserID, 
      courseId: course._id, 
    });
    await newPurchase.save();

    res.status(201).json({
      message: "Purchase successful",
    });

    

  }catch(err){
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }

});

//Get all purchases route
userRouter.get("/purchases", userAuth, async function (req, res) {
  try{

    const allPurchases = await PurchaseModel.find({ userId: req.decodedUserID });

    res.json({allPurchases});

  }catch(err){
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
});

module.exports = {
  userRouter: userRouter,
};
