const {UserModel} = require("../db/db");
const jwt = require("jsonwebtoken");

async function userAuth(req, res, next) {
  const tokenHeader = req.headers["authorization"];

  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  decodedUser = await jwt.verify(token, process.env.JWT_SECRET);

  const validUser = await UserModel.findById(decodedUser.userID);

  if (!validUser) {
    return res.status(401).json({
      message: "User not found! Please sign in again with proper credentials",
    });
  }

    //send the decoded user id to the next route
    req.decodedUserID = decodedUser.userID;
    next();
  }


module.exports = {
  userAuth,
};
