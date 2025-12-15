import passport from 'passport'
import local from 'passport-local'
import jwt, { ExtractJwt } from 'passport-jwt'

import UserManager from '../dao/mongo/UserMongoDAO.js'
import UserService from '../services/UserService.js'
import { isValidPassword } from '../utils/passwordUtils.js'
import UserDto from '../dto/UserDTO.js'

const userManager = new UserManager()
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
                const user = await userService.getUserById(jwt_payload.id);
                if (!user) return done(null, false);
                return done(null, jwt_payload)
            } catch (error) {
                return done(error, null)
            }
        }))

    passport.use('updateUsers', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWTSECRET,
        },
        async (jwt_payload, done) => {
            try {
                const user = await userService.getUserById(jwt_payload.id)
                if (!user) return done(null, false)
                const userUpdate = new UserDto(user)
                userUpdate.email = user.email
                return done(null, userUpdate)
            } catch (error) {
                return done(error, null)
            }

        }

    ))

    passport.use('authAdmin', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWTSECRET,
        },
        async (jwt_payload, done) => {
            try {
                const user = await userService.getUserById(jwt_payload.id)
                if (!user) return done(null, false)
                const userUpdate = new UserDto(user)
                userUpdate.role = user.role
                return done(null, userUpdate)
            } catch (error) {
                return done(error, null)
            }

        }

    ))

    passport.use('login', new LocalStategy(
        {
            usernameField: 'email',
        },
        async (username, password, done) => {
            try {
                const user = await userService.getUserByEmail(username)
                if (!user) {
                    return done(null, false)
                }

                const passportValid = isValidPassword(password, user.password)
                if (!passportValid) {
                    return done(null, false)
                }

                return done(null, user)

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
                return done(null, new UserDto(user))
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => done(null, user._id.toString()))

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.getUserById(id)
            done(null, new UserDto(user))
        } catch (error) {
            done(error, null)
        }
    })
}

export default initializePassport

