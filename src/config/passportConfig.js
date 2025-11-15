import passport from 'passport'
import local from 'passport-local'
import jwt, { ExtractJwt } from 'passport-jwt'

import UserModel from '../models/userModel.js'
import UserManager from '../managers/UserManager.js'
import UserService from '../services/UserService.js'
import { isValidPassword } from '../utils/passwordUtils.js'
import User from '../entities/User.js'

const userManager = new UserManager(UserModel)
const userService = new UserService(userManager)

const LocalStategy = local.Strategy
const JwtStrategy = jwt.Strategy

const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['authCookie']
    }
    return token
}

const initializePassport = () => {
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWTSECRET,
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload)
            } catch (error) {
                return done(error, null)
            }
        }))

    passport.use('login', new LocalStategy(
        {
            usernameField: 'email',
        },
        async (username, password, done) => {
            try {
                const user = await userManager.getUserByEmail({ email: username })
                if (!user) {
                    return done(null, false)
                }

                const passportValid = isValidPassword(password, user.password)
                if (!passportValid) {
                    return done(null, false)
                }

                return done(null, new User(user))

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('register', new LocalStategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            try {
                const user = await userService.createUser(req.body)
                return done(null, new User(user))
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => done(null, user._id))

    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserByEmail(id)
        done(null, user)
    })
}

export default initializePassport

