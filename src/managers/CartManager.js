class CartManager {
    constructor(cartPersistence){
        this.cartPersistence = cartPersistence
    }

    static async addCart(data) {
        cartPersistence.setEntidad(data)
        try {
            const id = await cartPersistence.save()
            return id
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getAllCarts() {
        try {
            return await cartPersistence.find()
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    static async getCartById(id) {
        try {
            return await cartPersistence.findById(id)
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    static async updateCart(id, data) {
        try {
            await cartPersistence.findByIdAndUpdate(id, data)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default CartManager