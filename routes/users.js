const express = require('express');
const router = express.Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');
const req = require('express/lib/request');
require('dotenv').config();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = new User({username, password})
        await user.save()
        res.send(user)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

let refreshTokens = []

router.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ userId: user._id });
      res.json({ accessToken: accessToken })
    })
  })

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        
        if (user && user.password === password) {
            const userID = { userId: user._id };
            const accessToken = generateAccessToken(userID);
            const refreshToken = jwt.sign(userID, process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken)
            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/protected', authenticateToken, (req, res, next) => {
    res.send("This is a protected route");
})




function generateAccessToken(userID) {
    return jwt.sign(userID, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader  && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error) {
            console.error("Token verification error:", error);
            return res.sendStatus(403)
        }
        req.user = user
        next()
    }) 
}


module.exports = router;