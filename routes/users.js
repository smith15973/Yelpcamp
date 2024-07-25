const express = require('express')
const router = express.Router()

const passport = require('passport')
const { register, renderRegister, renderLogin, login, logout } = require('../controllers/users')

router.route('/register')
    .get(renderRegister)
    .post(register)

router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), login)

router.get('/logout', logout);

module.exports = router;