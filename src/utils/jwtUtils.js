import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWTSECRET

export const createToken = (payload, options) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: options }); 
}

export const generarTokenRecuperacion1H = (userId) => {
    const msEnUnaHora = 60 * 60 * 1000; 
    
    const tiempoExpiracionUnix = Math.floor((new Date().getTime() + msEnUnaHora) / 1000);

    const payload = {
        sub: userId,
        type: 'recovery',
        exp: tiempoExpiracionUnix 
    }

    return jwt.sign(payload, jwtSecret); 
}


export const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret)
}