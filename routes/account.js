const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validatePassword = require('../middlewares/validatePassword')
const authenticateToken = require('../middlewares/authenticateToken')
const checkRefreshToken = require('../middlewares/checkRefreshToken')

router.patch('/newUsername', authenticateToken, async (req, res) => {
    const { username } = req.body

    try {
        const foundUser = await User.findOne({userId: req.user._id})
        foundUser.username = username
        await foundUser.save()
        res.json({ message: 'Username updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Sorry we are having some problems right now, kindly try again.'})
    }
})

router.patch('/newPassword', validatePassword, authenticateToken, async (req, res) => {
    const { password, newPassword } = req.body

    try {
        const user = await User.findOne({userId: req.user._id})

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({ message: 'Wrong password' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Sorry we are having some problems right now, kindly try again.'})
    }
})

router.delete('/deleteAccount', checkRefreshToken, authenticateToken,  async (req, res) => {
    const {password} = req.body

    const user = await User.findOne({userId: req.user._id})

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
            return res.status(403).json({ message: 'Wrong password' });
    }
    await req.checkRefreshToken.deleteOne()
    try {
        await user.deleteOne()
        res.status(200).json({message: 'Your account got deleted successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Sorry we are having some problems right now, kindly try again.'})
    }
})





module.exports = router