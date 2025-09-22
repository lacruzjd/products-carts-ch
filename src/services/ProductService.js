import { config } from "../config/config.js"
import Product from "../entities/Product.js"
import ProductManager from "../managers/ProductManager.js"
import PersisteciaJson from "../services/PersistenciaArchivoJsonDAO.js"
import StorageService from "./StorageService.js"
import path from "path"

const archivoDePersistencia = path.join(config.paths.db, 'products.json')
const persisteciaJson = new PersisteciaJson(archivoDePersistencia)
const porductManager = new ProductManager(persisteciaJson)

export default class ProductService {

    static async createProduct(productData) {
        try {
            const { newProduct, fotos } = productData
            const urlImagenes = await StorageService.saveImages({ fotos, nombresImagenes: newProduct.thumbnails })

            newProduct.thumbnails = urlImagenes

            const productToSve = new Product(newProduct)

            return await porductManager.addProducts(productToSve)
        } catch (error) {
            throw new Error(`No se pudo agregar el producto ${error.message}`)
        }
    }

    static async getAllProducts() {
        const productList = await porductManager.getProducts()
        if (!productList) throw new Error('No hay productos a la venta')
        return productList
    }

    static async getProductsById(id) {
        const product = await porductManager.getProductById(id)
        if (!product) throw new Error('Producto no encontrado')
        return product
    }

    static async updateProducts(id, data) {
        console.log(data)
        return porductManager.updateProduct(id, data)
    }

    static async deleteProduct(id) {
        const product = await this.getProductsById(id)
        const imagesDelete = product.thumbnails
        console.log(await imagesDelete)
        await porductManager.deleteProduct(id)
        await StorageService.deleteImages(imagesDelete)
    }
}