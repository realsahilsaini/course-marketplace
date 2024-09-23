const jwt = require("jsonwebtoken");

async function adminAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }


    const decodedAdminID = await jwt.verify(token, process.env.JWT_SECRET);

    req.decodedAdminID = decodedAdminID.adminId;

    next();
  // });
}

module.exports = {
  adminAuth,
};
