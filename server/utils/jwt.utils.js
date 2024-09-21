const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,

    };
    return jwt.sign(payload, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secretKey);
    } catch (error) {
        return null;
    }
};

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
};

module.exports = { generateToken, verifyToken, authenticate };