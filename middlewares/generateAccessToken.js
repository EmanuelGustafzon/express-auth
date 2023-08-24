const jwt = require('jsonwebtoken');

function generateAccessToken(userID) {
    return jwt.sign(userID, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12m' })
}

module.exports = generateAccessToken