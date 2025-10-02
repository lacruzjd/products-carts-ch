//Clase para gestionar los productos
export default class CartManager {
    constructor(model) {
        if(!model) throw new Error('Debe agregar un modelo de persistencia')
        this.model = model
    }

    async createCart(newCart) {
        try {
            const cartSaved = new this.model(newCart)
            return cartSaved.save()
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`)
        }
    }

    async getCarts() {
        try {
            return await this.model.find()
        } catch (error) {
            throw new Error(`Ocurrio un error al obtener el carrito: ${error.message}`)
        }
    }

    async getCartById(cid) {
        try {
            const productById = await this.model.findById(cid)
            return productById
        } catch (error) {
            throw new Error(`No se pudo obtener el carrito: ${error.message}`)
        }
    }

    async updateCart(cid, newProducts) {
        console.log(newProducts)
        try {
            return await this.model.findByIdAndUpdate(cid, newProducts)
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`)
        }
    }
}