import fs from 'fs/promises'

export class ReadWriteFile {
    static async readFile(path) {
        try {
            let data = await fs.readFile(path, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            throw new Error(`Archivo no encontrado: ${error.message}`)
        }
    }

    static async writeFIle(path, data) {
        try {
            await fs.writeFile(path, JSON.stringify(data, null, 2))
        } catch (error) {
            throw new Error(`Error al escribir en archivo: ${error.message}`)
        }
    }
}