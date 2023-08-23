function validatePassword(req, res, next) {
    if(req.body.password.length < 6) return res.json({message: 'The password needs to have atleast 6 characters'})
    next()
}

module.exports = validatePassword