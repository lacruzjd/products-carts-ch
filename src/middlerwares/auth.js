import passport from "passport"

export function auth(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err)
        if (!user) return res.status(400).send({ message: 'Debe logearse para acceder a este recurso' })
            req.user = user
        next()
    })(req, res, next)
}

export function current(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        req.user = user
        next()
    })(req, res, next)
}

export function authUpdate(req, res, next) {
    passport.authenticate('updateUsers', { session: false }, (err, user) => {
        if (err) return next(err)
            if (!user) return res.status(400).send({ message: 'Debe logearse para acceder a este recurso' })
                req.user = user
        next()
    })(req, res, next)
}

export function authAdmin(req, res, next) {
    passport.authenticate('authAdmin', { session: false }, (err, user) => {
        console.log('admin', user)
        if (err) return next(err)
        if (!user) return res.status(400).send({ message: 'Debe logearse para acceder a este recurso' })
        if (user.role !== 'admin') return res.status(400).send({ message: 'No esta autorizado para acceder a este recurso' })
        req.user = user
        next()
    })(req, res, next)
}