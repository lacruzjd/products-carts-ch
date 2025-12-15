import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWTSECRET

// 2. createToken: Función genérica que NO espera un segundo argumento obligatorio
export const createToken = (payload, options) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: options }); 
};

// 3. generarTokenRecuperacion1H: Tu lógica específica que usa 'createToken'
export const generarTokenRecuperacion1H = (userId, horaDeInicioFija) => {
    
    const msEnUnaHora = 60 * 60 * 1000;
    const tiempoExpiracionUnix = Math.floor((horaDeInicioFija.getTime() + msEnUnaHora) / 1000);

    const payload = {
        sub: userId,
        type: 'recovery',
        exp: tiempoExpiracionUnix // <-- Inyectamos 'exp' aquí
    };

    // Llamada LIMPIA: Solo pasamos UN argumento (el payload)
    return createToken(payload); 
};



export const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret)
}