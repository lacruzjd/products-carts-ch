import crypto from 'crypto'

export class PasswordHasher {
    static hash(value) {
        try {
            const hashed = crypto.createHash('sha256')
            hashed.update(value)
            return hashed.digest('hex')
        } catch (error) {
            throw new Error(`Error al hashear Password: ${error.message}`)
        }
    }
}
