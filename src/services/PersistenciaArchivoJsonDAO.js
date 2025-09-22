import fs from 'fs/promises'

export default class PersistenciaArchivoJsonDAO {
    constructor(path) {
        this.path = path
    }

    // Metodos privados para operaciones de bajo nivel
    async  #getData() {
        try {
            await fs.access(this.path)
        } catch {
            await this.#saveData([])
        }
        const data = await fs.readFile(this.path, 'utf8')
        return JSON.parse(data)
    }

    async #saveData(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2))
    }

    // Metodos para la logica de persistencia
    async save(entidad) {
        // Agregar un id unico a cada entidad
        const entidadToSave = { id: crypto.randomUUID(), ...entidad }
        const file = await this.#getData()
        file.push(entidadToSave)

        await this.#saveData(file)
        return entidadToSave
    }

    async find() {
        return await this.#getData()
    }

    async findById(id) {
        const file = await this.#getData()
        return file.find(product => product.id === id)
    }

    async findByIdAndUpdate(id, data) {
        const file = await this.#getData()
        const dataToUptade = await file.find(e => e.id === id)
        console.log(data)
        
        if (dataToUptade) {
            Object.keys(await data).forEach(k => {
                if (k !== dataToUptade[k] && k !== 'id') {
                    dataToUptade[k] = data[k]
                } else {
                    throw new Error('No se puede actualizar')
                }
            })

            await this.#saveData(file)
            return dataToUptade
        } else {
            throw new Error('Dato no encontrado')
        }
    }

    async findByIdAndDelete(id) {
        let file = await this.#getData()
        const dataToDelete = await this.findById(id)

        if (dataToDelete) {
            file = await file.filter(e => e.id !== id)
            await this.#saveData(file)
            return true
        } else {
            return false
        }
    }
}