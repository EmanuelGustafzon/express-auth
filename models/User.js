const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User;