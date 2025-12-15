import Cart from "../entities/Cart.js"

export default class CartService {
    constructor(cartDao, productDao) {
        this.cartDao = cartDao
        this.productDao = productDao
    }

    async createCart() {
            const newCart = new Cart()
            const cartSaved = await this.cartDao.save(newCart)
            return cartSaved
    }

    async getCarts() {
        const carts = await this.cartDao.getAll()

        if (!carts) throw new Error(`Carrito no encontrado`)

        return carts
    }

    async getCartById(cid) {
        try {
            if (!cid) throw new Error('Se requiere el id del carrito')
            return  await this.cartDao.getCartById(cid)
        } catch (error) {
            throw new Error('Carrito no encontrado')
        }
    }

    async addProductToCart(cid, pid) {
        if (!pid && pid) throw new Error('Se requiere el id del carrito y el id del producto')

        const cartProducts = await this.getCartById(cid)

        const product = await this.productDao.getProductById(pid)

        if (product.stock === 0) throw new Error('No hay stock del producto')

        let productInCart = cartProducts.products.find(p => p.product._id.equals(product._id))

        if (cartProducts.products.length === 0 && !productInCart) {
            cartProducts.products.push({ product: product._id, quantity: 1 })
        } else if (productInCart) {
            productInCart.quantity++
        } else {
            cartProducts.products.push({ product: product._id, quantity: 1 })
        }

        await this.cartDao.update(cid, { products: cartProducts.products })

        // product.stock--
        // await this.productDao.update(pid, { stock: product.stock })
    }

    async deleteProductCart(cid, pid) {
        if (!pid && pid) throw new Error('Se requiere el id del carrito y el id del producto')

        const cartProducts = await this.getCartById(cid)
        const productSaved = await this.productDao.getProductById(pid)
        
        const product = cartProducts.products.find(p => p.product._id.equals(productSaved._id.toString()))

        if (!product) {
            throw new Error(`Producto no encontrado en el carrito${error.message}`)
        }

        const updatedProducts = cartProducts.products.filter(p => p.product._id.toString() !== productSaved._id.toString())
        await this.cartDao.update(cid, { products: updatedProducts })

        // productSaved.stock = productSaved.stock + product.quantity
        // await this.productDao.update(pid, { stock: productSaved.stock })
    }

    async updateProducts(cid, newProducts) {
        if (!cid && !newProducts) throw new Error('Se requiere el id del producto y los datos a actualizar')

        const cart = await this.getCartById(cid)
        if (!cart) throw new Error('El carrito esta vacio')

        // for (const product of cart.products) {
            // let productSaved = await this.productDao.getProductById(product.product._id)
            // productSaved.stock = productSaved.stock + product.quantity
            // await this.productDao.update(productSaved._id, { stock: productSaved.stock })
        // }
        await this.cartDao.update(cid, { products: newProducts })
    }

    async updateQtyProductCart(cid, pid, quantity) {
        if (!cid && !pid && !quantity) throw new Error('Se requiere el id del carrito, producto y cantidad')

        const newQuantity = Number.parseInt(quantity)

        if (Number.isNaN(newQuantity) || newQuantity <= 0) {
            throw new Error('La cantidad debe ser un número positivo.');
        }

        const cartProducts = await this.getCartById(cid);
        const product = await this.productDao.getProductById(pid)

        if (!product) {
            throw new Error('Producto no encontrado.')
        }

        const productInCart = cartProducts.products.find(p => p.product._id.equals(product._id))
        const oldQuantity = productInCart ? productInCart.quantity : 0;

        const quantityDifference = newQuantity - oldQuantity;
        if (product.stock < quantityDifference) {
            throw new Error(`Stock insuficiente. Solo quedan ${product.stock} unidades.`)
        }

        // product.stock -= quantityDifference

        if (productInCart) {
            productInCart.quantity = newQuantity
        } else {
            cartProducts.products.push({ product: product._id, quantity: newQuantity })
        }

        await this.cartDao.update(cid, { products: cartProducts.products })
        // await this.productDao.update(pid, { stock: product.stock })

        return { message: 'Cantidad actualizada exitosamente.' }
    }

    async deleteAllProducts(cid) {
        if (!cid) throw new Error('Se requiere el id del carrito')

        // const productsInCart = await this.cartDao.getById(cid)

        // for (const product of productsInCart.products) {
        //     await this.deleteProductCart(cid, product.product._id)
        // }
        
        await this.cartDao.update(cid, { products: [] })
    }

    async deleteCart(cid) {
        if (!cid) throw new Error('Se requiere el id del carrito')
        await this.cartDao.delete(cid)
    }

}