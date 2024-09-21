const {UserModel} = require('../db/db');
const jwt = require('jsonwebtoken');



async function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findOne({ username: decodedUser.username });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        console.log("Error finding user", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    authMiddleware,
}