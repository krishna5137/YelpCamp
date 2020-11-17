const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.currentUrl = req.originalUrl;
        req.flash('error', 'Must be signed-in');
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;
