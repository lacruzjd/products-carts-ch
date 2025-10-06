import Cart from "../entities/Cart.js"

export default class CartService {
    constructor(cartManager, productManager) {
        this.cartManager = cartManager
        this.productManager = productManager
    }

    async createCart() {
        const cart = await this.cartManager.getCarts()

        if (cart.length === 0) {
            const newCart = new Cart()
            const cartSaved = await this.cartManager.createCart(newCart)
            return cartSaved
        }

        return cart[0]
    }

    async getCarts() {
        const carts = await this.cartManager.getCarts()

        if (!carts) throw new Error(`Carrito no encontrado`)

        return carts
    }

    async getCartById(cid) {
        if (!cid) throw new Error('Se requiere el id del carrito')

        const cart = await this.cartManager.getCartById(cid)
        if (!cart) throw new Error('Carrito no encontrado')

        return cart
    }

    async addProductToCart(cid, pid) {
        if (!pid && pid) throw new Error('Se requiere el id del carrito y el id del producto')

        const cartProducts = await this.getCartById(cid)

        const product = await this.productManager.getProductById(pid)

        if (product.stock === 0) throw new Error('No hay stock del producto')

        let productInCart = cartProducts.products.find(p => p.product._id.equals(product._id))

        if (cartProducts.products.length === 0 && !productInCart) {
            cartProducts.products.push({ product: product._id, quantity: 1 })
        } else if (productInCart) {
            productInCart.quantity++
        } else {
            cartProducts.products.push({ product: product._id, quantity: 1 })
        }

        await this.cartManager.updateCart(cid, { products: cartProducts.products })

        product.stock--
        await this.productManager.updateProduct(pid, { stock: product.stock })
    }

    async deleteProductCart(cid, pid) {
        if (!pid && pid) throw new Error('Se requiere el id del carrito y el id del producto')

        const cartProducts = await this.getCartById(cid)
        const productSaved = await this.productManager.getProductById(pid)
        
        const product = cartProducts.products.find(p => p.product._id.equals(productSaved._id.toString()))

        if (!product) {
            throw new Error(`Producto no encontrado en el carrito${error.message}`)
        }

        const updatedProducts = cartProducts.products.filter(p => p.product._id.toString() !== productSaved._id.toString())
        await this.cartManager.updateCart(cid, { products: updatedProducts })

        productSaved.stock = productSaved.stock + product.quantity
        await this.productManager.updateProduct(pid, { stock: productSaved.stock })
    }

    async updateProducts(cid, newProducts) {
        if (!cid && !newProducts) throw new Error('Se requiere el id del producto y los datos a actualizar')

        const cart = await this.getCartById(cid)
        if (!cart) throw new Error('El carrito esta vacio')

        for (const product of cart.products) {
            let productSaved = await this.productManager.getProductById(product.product._id)
            productSaved.stock = productSaved.stock + product.quantity
            await this.productManager.updateProduct(productSaved._id, { stock: productSaved.stock })
        }
        await this.cartManager.updateCart(cid, { products: newProducts })
    }

    async updateQtyProductCart(cid, pid, quantity) {
        if (!cid && !pid && !quantity) throw new Error('Se requiere el id del carrito, producto y cantidad')

        const newQuantity = Number.parseInt(quantity)

        if (Number.isNaN(newQuantity) || newQuantity <= 0) {
            throw new Error('La cantidad debe ser un número positivo.');
        }

        const cartProducts = await this.getCartById(cid);
        const product = await this.productManager.getProductById(pid)

        if (!product) {
            throw new Error('Producto no encontrado.')
        }

        const productInCart = cartProducts.products.find(p => p.product._id.equals(product._id))
        const oldQuantity = productInCart ? productInCart.quantity : 0;

        const quantityDifference = newQuantity - oldQuantity;
        if (product.stock < quantityDifference) {
            throw new Error(`Stock insuficiente. Solo quedan ${product.stock} unidades.`)
        }

        product.stock -= quantityDifference

        if (productInCart) {
            productInCart.quantity = newQuantity
        } else {
            cartProducts.products.push({ product: product._id, quantity: newQuantity })
        }

        await this.cartManager.updateCart(cid, { products: cartProducts.products })
        await this.productManager.updateProduct(pid, { stock: product.stock })

        return { message: 'Cantidad actualizada exitosamente.' }
    }

    async deleteAllProducts(cid) {
        if (!cid) throw new Error('Se requiere el id del carrito')

        await this.updateProducts(cid)
        await this.cartManager.updateCart(cid, { products: [] })
    }
}