const jwt = require("jsonwebtoken");

async function adminAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedAdmin) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    //send the decoded admin id to the next route
    req.decodedAdminID = decodedAdmin.adminID;
    next();
  });
}

module.exports = {
  adminAuth,
};
