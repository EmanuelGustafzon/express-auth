const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const refreshTokenSchema = new Schema({
    token: {
        type: String,
    }
}, {timestamps: true})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

module.exports = RefreshToken