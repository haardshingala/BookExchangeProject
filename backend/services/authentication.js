const JWT = require("jsonwebtoken");


function createTokenForUser(user){
    const payload = {
        _id : user._id,
        email: user.email,
        role: user.role,
    };
    const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '15d' });
    return token;
}

module.exports = { createTokenForUser };