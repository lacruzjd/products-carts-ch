import path from 'path'
import { config } from "../config/config.js"
import ProductModel from "../models/productModel.js"
import ProductManager from "../managers/ProductManager.js"
import ProductService from "../services/ProductService.js"
import StorageService from "../services/StorageService.js"

const ruta = path.join(config.dataBase.dbJson, 'products.json')

const productManager = new ProductManager(ProductModel)
const storageImagenes = new StorageService(config.paths.products.imageStorage, config.paths.products.imageUrl)
const productService = new ProductService(productManager, storageImagenes)

//socket para manejar productos servidor
export default function socketServer(io) {
    io.on('connection', async socket => {
        console.log(`socket id: ${socket.id} conectado`)

        socket.emit('productsList', await productService.getProducts())

        socket.on('newProduct', async (datos, callback) => {
            try {

                await productService.createProduct(datos)

                socket.emit('productsList', await productService.getProducts())
                callback({ status: 'ok', message: 'Producto agregado correctamente' })

            } catch (error) {
                callback({ status: 'error', message: error.message })
            }
        })

        socket.on('deleteProduct', async (id) => {
            try {
                await productService.deleteProduct(id)

                socket.emit('productsList', await productService.getProducts());

            } catch (error) {
                socket.emit('error', { message: `${error.message}` });
            }
        })

        socket.on('disconnect', (data) => {
            console.log(data, socket.id, 'desconectado')
        })
    })
}
