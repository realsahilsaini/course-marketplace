const jwt = require("jsonwebtoken");

async function userAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    //send the decoded user id to the next route
    req.decodedUserID = decodedUser.userID;
    next();
  });
}

module.exports = {
  userAuth,
};
