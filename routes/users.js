const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


router.post('/register', validatePassword, async (req, res) => {
    const { username, password } = req.body;
    try{
        const existingUser = await User.findOne({username: username})
        if(existingUser) {
            return res.status(409).send('Username already exsis');
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({username, password: hashedPassword});
        await user.save();
        res.send('Registration successful!');

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            const userId = { userId: user._id };
            const accessToken = generateAccessToken(userId);
            const refreshToken = jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '72h'})
            const saveToken = new RefreshToken({token: refreshToken})
            await saveToken.save()
            res.setHeader('Access-Token', `Bearer ${accessToken}`)
            res.setHeader('Refresh-Token', `Bearer ${refreshToken}`)
            res.json({ message: 'Response with custom header' });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/logout', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshtoken = authHeader.split(' ')[1]

    if(refreshtoken == null) return res.sendStatus(401)
    try {
        const findRefreshToken = await RefreshToken.findOne({token: refreshtoken})
        if(!findRefreshToken) return res.sendStatus(401)
        await findRefreshToken.deleteOne()
        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/renewToken', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshtoken = authHeader.split(' ')[1]

    if(refreshtoken == null) return res.sendStatus(401)

    try {
        const findRefreshToken = await RefreshToken.findOne({token: refreshtoken})
        if(!findRefreshToken) return res.sendStatus(401)

        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if(error) return res.sendStatus(403)
            const accessToken = generateAccessToken({userId: user._id});
            res.setHeader('Access-Token', `Bearer ${accessToken}`)
            res.json({ message: 'New access token sent as header' });
        })
    } catch (error) {
        res.json({message: error})
    }
}) 

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

function validatePassword(req, res, next) {
    if(req.body.password.length < 6) return res.send('The password needs to have atleast 6 characters')
    next()
}

module.exports = router;