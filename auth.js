const db = require('./db/models')

const loginUser = (req, res, user) => {
    db.Session.auth = {
        userId: user.id
    }
}

const requireAuth = (req, res, next) => {
    if (!res.locals.authenticated) {
      return res.redirect('/users/login');
    }
    return next();
};

const logoutUser = (req, res) => {
    delete req.session.auth;
};

const restoreUser = async (req, res, next) => {
    if (req.session.auth) {
        const { userId } = req.session.auth
        console.log(userId)

        try {
            const user = await db.User.findByPk(userId)

            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user
                next()
            }
        } catch (err) {
            res.locals.authenticated = false
            next(err)
        }
    } else {
        res.locals.authenticated = false
        next()
    }
}

module.exports = { loginUser, restoreUser, logoutUser, requireAuth }
