import passport from "passport"

export default function handleRegister(req, res, next) {
    passport.authenticate('register', (error, user, info) => {
        if (error) {
            req.authError = error.message
            next()
        }

        if (!user) {
            req.authError = info?.message || 'Error de registro';
            next()
        }

        req.user = user
        next()

    })(req, res, next);
}