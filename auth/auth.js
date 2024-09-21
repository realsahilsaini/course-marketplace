const {UserModel} = require('../db/db');


async function authMiddleware(req, res, next) {
    const { username } = req.body;

    try {
        const user = await UserModel.findOne({ username });

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