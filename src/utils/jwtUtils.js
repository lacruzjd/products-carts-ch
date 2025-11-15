import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWTSECRET

export const createToken = (user, expires) => {
    return jwt.sign({ user }, jwtSecret, { expiresIn: expires })
}

export const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret)
}