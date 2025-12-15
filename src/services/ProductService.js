import Product from '../entities/Product.js'

export default class ProductService {
    constructor(productManager, storageServiceFotos) {
        this.productManager = productManager
        this.storageServiceFotos = storageServiceFotos
    }

    async createProduct(productData) {
        const { newProduct, fotos } = productData

        if (!newProduct && !fotos) throw new Error('Se requieren los datos del producto y las fotos')

        if (!newProduct.thumbnails) {
            newProduct.thumbnails = []
        }

        if (fotos) {
            const urlImagenes = await this.storageServiceFotos.saveImages({ fotos, nombresImagenes: newProduct.thumbnails })
            newProduct.thumbnails = urlImagenes
        }

        const productSaved = await this.productManager.getAll()

        if (productSaved.some(p => p.code === newProduct.code)) {
            this.storageServiceFotos.deleteImages(newProduct.thumbnails)
            throw new Error(`codigo de producto duplicado`)
        }

        let productToSave = null

        try {
            productToSave = new Product(newProduct)
        } catch (error) {
            this.storageServiceFotos.deleteImages(newProduct.thumbnails)
            throw new Error(`Faltan datos ${error.message}`)
        }

        return await this.productManager.save(productToSave)
    }

    async getProducts(page, limit, category, order_price) {
        const productList = await this.productManager.getProducts(page, limit, category, order_price)

        if (!productList) throw new Error('No hay productos en la lista')

        return productList
    }

    async getAllProducts() {
        const productList = await this.productManager.getAll()
        if (!productList) throw new Error('No hay productos en la lista')
        return productList
    }

    async getProductById(pid) {
        if (!pid) throw new Error(`Es necesario pasar el id del producto`)

        const product = await this.productManager.getById(pid)

        if (!product) throw new Error(`Producto con id ${pid} no encontrado`)

        return product
    }

    async updateProduct(pid, data) {
        if (!pid & !data) throw new Error('Se requieren el id del producto y los datos a actualizar')

        const updatedProduct = await this.productManager.update(pid, data)

        if (!updatedProduct) throw new Error('No se encontro el Producto a actualizar')

        return updatedProduct
    }

    async deleteProduct(pid) {
        if (!pid) throw new Error('Se requiere el id del producto')

        const productToDelete = await this.getProductById(pid)

        if (productToDelete) {
            await this.productManager.delete(pid)
            if (productToDelete.thumbnails && productToDelete.thumbnails.length > 0) {
                await this.storageServiceFotos.deleteImages(productToDelete.thumbnails)
            }
        } else {
            throw new Error('No se encontro el producto')
        }
    }

    async getCategoriesProducts() {
        return this.productManager.getProductAtribute('category')
    }
}