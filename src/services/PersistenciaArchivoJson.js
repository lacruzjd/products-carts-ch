import fs from 'fs/promises'

export default class PersistenciaArchivoJson {
    constructor(path) {
        this.path = path
    }

    async getData() {
        try {
            try {
                await fs.access(this.path);
            } catch {
                await this.saveData([])
            }

            const data = await fs.readFile(this.path, 'utf8')
            return JSON.parse(data)

        } catch (error) {
            throw new Error(`Archivo no encontrado: ${error.message}`)
        }
    }

    async saveData(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2))
        } catch (error) {
            throw new Error(`Error al escribir en archivo: ${error.message}`)
        }
    }
}