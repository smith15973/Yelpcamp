const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/register')
    }
})

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = catchAsync(async (req, res) => {      
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    res.redirect(redirectUrl)
})

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}