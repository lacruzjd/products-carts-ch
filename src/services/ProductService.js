import Product from '../entities/Product.js'

export default class ProductService {
    constructor(productManager, storageServiceFotos) {
        this.productManager = productManager
        this.storageServiceFotos = storageServiceFotos
    }

    async createProduct(productData) {
        try {
            const { newProduct, fotos } = productData

            if (!newProduct.thumbnails) {
                newProduct.thumbnails = []
            }

            if (fotos) {
                const urlImagenes = await this.storageServiceFotos.saveImages({ fotos, nombresImagenes: newProduct.thumbnails })
                newProduct.thumbnails = urlImagenes
            }

            const productSaved = await this.getAllProducts()

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

            return await this.productManager.addProduct(productToSave)
        } catch (error) {
            throw new Error(`No se pudo agregar el producto: ${error.message}`)
        }
    }

    async getAllProducts() {
        try {
            const productList = await this.productManager.getProducts()
            if (!productList) throw new Error('No hay productos en la lista')
            return productList
        } catch (error) {
            throw new Error(`No se pudo obtener los productos: ${error.message}`)

        }

    }

    async getProductById(pid) {
        try {
            const product = await this.productManager.getProductById(pid)
            if (!product) throw new Error(`Producto con id ${pid} no encontrado`)
            return product
        } catch (error) {
            throw new Error(`No se pudo encontrar el producto: ${error.message}`)

        }
    }

    async updateProduct(pid, data) {
        try {
            const updatedProduct = await this.productManager.updateProduct(pid, data)
            if (!updatedProduct) throw new Error('No se encontro el Producto a actualizar')
            return updatedProduct
        } catch (error) {

            throw new Error(`No se pudo actualizar el producto: ${error.message}`)
        }

    }

    async deleteProduct(pid) {
        try {
            const productToDelete = await this.getProductById(pid)
            if (productToDelete) {
                await this.productManager.deleteProduct(pid)
                if (productToDelete.thumbnails && productToDelete.thumbnails.length > 0) {
                    await this.storageServiceFotos.deleteImages(productToDelete.thumbnails)
                }
            }
        } catch (error) {
            throw new Error(`No se pudo Eliminar el producto: ${error.message}`)
        }
    }
}