const { UserModel } = require("../db/db");
const { Router } = require("express");
const { authMiddleware } = require("../auth/auth");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const userRouter = Router();

//Input validation schema
const requiredBody = z.object({
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
});

//User signup
userRouter.post("/signup", async function (req, res) {
  try {
    const validatedBody = requiredBody.parse(req.body);

    const existingUser = await UserModel.findOne({
      username: validatedBody.username,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new UserModel(validatedBody);
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
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

//User signin
userRouter.post("/signin", async function (req, res) {
  try {
    const validatedBody = requiredBody.parse(req.body);

    const user = await UserModel.findOne({ 
        username: validatedBody.username
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password !== validatedBody.password) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);

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

userRouter.post("/purchase", authMiddleware, function (req, res) {
    const user = req.user;
  res.json({
    message: `${user.username} can purchase`,
  });
});

userRouter.get("/purchases", authMiddleware, function (req, res) {
  res.json({
    message: `Purchase history for ${req.user.username}`,
  });
});

module.exports = {
  userRouter: userRouter,
};
