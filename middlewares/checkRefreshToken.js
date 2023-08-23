const RefreshToken = require('../models/RefreshToken')

async function checkRefreshToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const refreshtoken = authHeader.split(' ')[1];
    if(refreshtoken == null) return res.sendStatus(401)
    try {
        const findRefreshToken = await RefreshToken.findOne({token: refreshtoken})
        if(!findRefreshToken) return res.sendStatus(401)
        req.findRefreshToken = findRefreshToken;
        next()
    } catch (error) {
        res.status(500).json({message: 'Sorry we are having some problems right now, kindly try again.'})
    }
}

module.exports = checkRefreshToken