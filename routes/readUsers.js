const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User')

router.post('/', async (req, res) => {
    const { username } = req.body

    try {
        const foundUser = await User.findOne({username})
        if (!foundUser) {
            return res.status(404).json({"error": "The user does not exist"})
        }
        res.send({ username: foundUser.username, _id: foundUser._id })
    } catch (error){
        console.log(error)
        res.status(500).json({message: 'Sorry we are having some problems right now, kindly try again.'})
    }
})

module.exports = router