export default class MongoDAO {
        constructor(model) {
                this.model = model
        }

        async save(newElement) {
                return await this.model.create(newElement)
        }

        async getAll() {
                return await this.model.find().lean()
        }

        async getById(id) {
                return await this.model.findById(id).lean()
        }

        async getBy(property) {
                return await this.model.findOne(property).lean()
        }
 
        async update(id, data) {
                return await this.model.findByIdAndUpdate(id, data, { new: true })
        }

        async delete(id) {
                await this.model.findByIdAndDelete(id)
        }
}