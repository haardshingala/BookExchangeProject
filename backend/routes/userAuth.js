const JWT = require("jsonwebtoken");

const AuthenticateToken = (req, res, next) => {

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token not found or invalid format" });
    }


    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "token not found" });
    }

    try {
        const data = JWT.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token expired, please login again" });
    }
    
}

module.exports = { AuthenticateToken };