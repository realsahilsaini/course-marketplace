const {UserModel} = require('../db/db');
const jwt = require('jsonwebtoken');



async function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        req.decodedUserID = decodedUser.userID;
        next();
    });
    
}


module.exports = {
    authMiddleware,
}