import nodemailer from 'nodemailer'

function transporter() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    transporter.verify(function (error, success) {
        if (error) {
            console.log('Error de conexión SMTP:', error)
        } else {
            console.log('Servidor SMTP listo para enviar correos')
        }
    })

    return transporter
}

/**
 * 
 * @param {Object} mailOptions mailOptions - Opciones del correo a enviar. Debe incluir
 * propiedades como `from`, `to`, `subject`, `text` o `html`, según lo requiera nodemailer.
 * 
 * @example
 * const mailOptions = {
 *   from: "remitente@example.com",
 *   to: "destinatario@example.com",
 *   subject: "Hola!",
 *   text: "Este es un mensaje de prueba."
 * }
 */

export default async function sendEmail(mailOptions) {
    try {
        const info = await transporter().sendMail(mailOptions)
        console.log("Correo enviado: %s", info.messageId);
        return info
    } catch (error) {
        console.log(`error al envia email ${error}`)
        return error
    }
}