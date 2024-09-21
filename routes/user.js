const { UserModel } = require("../db/db");
const { Router } = require("express");
const { authMiddleware } = require("../auth/auth");
const userRouter = Router();

userRouter.post("/signup", async function(req, res) {
    
    const {email, username, password, firstName, lastName} = req.body;

    try{

        const existingUser = await UserModel.findOne({ username });

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }

         await UserModel.create({
            email,
            username,
            password,
            firstName,
            lastName
        });


        res.status(201).json({ message: "Signup successful" });


    }catch(err){
        console.log("Error finding user", err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.post("/signin", async function(req, res) {
    const {username, password} = req.body;

    try{

        const user = await UserModel.findOne({ username });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        if(user.password !== password){
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        res.json({
            message: "Signin successful"
        });

    }catch(err){

        console.log("Error finding user", err);
        res.status(500).json({
            message: "Internal server error"
        });

    }
})

userRouter.post("/purchase", authMiddleware, function(req, res) {
    res.json({
        message: "purchase"
    })
})

userRouter.get("/purchases", authMiddleware, function(req, res) {
    res.json({
        message: "user purchases"
    })
})

module.exports = {
    userRouter: userRouter
}