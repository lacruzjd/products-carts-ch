//Clase para gestionar los productos
export default class Manager {
        constructor(model) {
                this.model = model
        }

        async save(newElement) {
                return await this.model.create(newElement)
        }

        async getAll() {
                return await this.model.find().lean()
        }

        async getBy(property) {
                return await this.model.findOne(property).lean()
        }

        async update(id, data) {
                return await this.model.findByIdAndUpdate(id, data)
        }

        async delete(id) {
                await this.model.findByIdAndDelete(id)
        }
}