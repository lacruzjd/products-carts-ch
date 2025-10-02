import Cart from "../entities/Cart.js"

export default class CartService {
    constructor(cartManager, productManager) {
        this.cartManager = cartManager
        this.productManager = productManager
    }

    async createCart() {
        try {
            const cart = await this.cartManager.getCarts()
            if (cart.length === 0) {
                const newCart = new Cart()
                const cartSaved = await this.cartManager.createCart(newCart)
                return cartSaved
            }
            return cart[0]
        } catch (error) {
            throw new Error(`No se pudo crear el carrito: ${error.message}`)
        }
    }

    async getCarts() {
        try {
            const carts = await this.cartManager.getCarts()
            return carts
        } catch (error) {
            throw new Error(`No se puede obtener el carrito: ${error.message}`)
        }
    }

    async getCartById(cid) {
        try {
            const cart = await this.cartManager.getCartById(cid)
            return cart
        } catch (error) {
            throw new Error('Carrito no encontrado')
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cartProducts = await this.getCartById(cid)
            const product = await this.productManager.getProductById(pid)

            if (product.stock === 0) throw new Error('No hay stock del producto')

            let productInCart = cartProducts.products.find(p => p.product.equals(product._id))

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

        } catch (error) {
            throw new Error(error.message)
        }

    }

    async deleteProductCart(cid, pid) {
        try {
            const cartProducts = await this.getCartById(cid)
            const productSaved = await this.productManager.getProductById(pid)
            const product = cartProducts.products.find(p => p.product.equals(productSaved._id.toString()))

            if (!product) {
                throw new Error(`Producto no encontrado en el carrito${error.message}`)
            }

            const updatedProducts = cartProducts.products.filter(p => p.product.toString() !== productSaved._id.toString())
            await this.cartManager.updateCart(cid, { products: updatedProducts })

            productSaved.stock = productSaved.stock + product.quantity
            await this.productManager.updateProduct(pid, { stock: productSaved.stock })

        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito`)
        }
    }

    async updateProducts(cid, newProducts) {
        try {
            // Obtener todos los productos del carrito 
            const cart = await this.getCartById(cid)
            if (!cart) throw new Error('El carrito esta vacio')
            //recorrer los productos y sumar cantidad a los productos almacenados
            for (const product of cart.products) {
                let productSaved = await this.productManager.getProductById(product.product)
                productSaved.stock = productSaved.stock + product.quantity
                await this.productManager.updateProduct(productSaved._id, { stock: productSaved.stock })
            }
            await this.cartManager.updateCart(cid, { products: newProducts })
        } catch (error) {
            throw new Error(`No se pueden actualizar los productos: ${error.message}`)
        }
    }

    async updateQtyProductCart(cid, pid, quantity) {
        try {
            // Convertir quantity a un número de forma segura y validarla
            const newQuantity = Number.parseInt(quantity);
            if (Number.isNaN(newQuantity) || newQuantity <= 0) {
                throw new Error('La cantidad debe ser un número positivo.');
            }

            const cartProducts = await this.getCartById(cid);
            const product = await this.productManager.getProductById(pid)

            if (!product) {
                throw new Error('Producto no encontrado.')
            }

            // Encontrar el producto en el carrito y su cantidad actual
            const productInCart = cartProducts.products.find(p => p.product.equals(product._id))
            const oldQuantity = productInCart ? productInCart.quantity : 0;

            // Calcular la diferencia y validar el stock
            const quantityDifference = newQuantity - oldQuantity;
            if (product.stock < quantityDifference) {
                throw new Error(`Stock insuficiente. Solo quedan ${product.stock} unidades.`)
            }

            // Ajustar el stock del producto
            product.stock -= quantityDifference

            // Actualizar la cantidad en el carrito (o añadirlo si no existe)
            if (productInCart) {
                productInCart.quantity = newQuantity
            } else {
                // Lógica para añadir el producto si no estaba en el carrito
                cartProducts.products.push({ product: product._id, quantity: newQuantity })
            }

            // Guardar los cambios
            await this.cartManager.updateCart(cid, { products: cartProducts.products })
            await this.productManager.updateProduct(pid, { stock: product.stock })

            return { message: 'Cantidad actualizada exitosamente.' }

        } catch (error) {
            throw new Error(`No se puede actualizar el producto: ${error.message}`)
        }
    }

    async deleteAllProducts(cid) {
        try {
            await this.updateProducts(cid)
            await this.cartManager.updateCart(cid, { products: [] })
        } catch (error) {
            throw new Error(error.message)
        }
    }

}