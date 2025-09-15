import ProductManager from "../managers/products.manager.js"
import PersienciaArchivoJson from "../services/PersistenciaArchivoJson.js"
import fs from 'fs'
import { config } from "../config/config.js"
import path from 'path'

const pathProducts = path.join(config.paths.db, 'products.json')
const persiencia = new PersienciaArchivoJson(pathProducts)
const productsManager = new ProductManager(persiencia)

//socket para manejar productos servidor
export default function socket(io) {
    io.on('connection', async socket => {
        console.log(`socket id: ${socket.id} conectado`)

        socket.emit('productsList', await productsManager.getProducts())

        socket.on('newProduct', async (datos, callback) => {
            try {
                const { newProduct, fotos } = datos

                await productsManager.addProducts(newProduct);

                if (newProduct.thumbnails.length > 0) {
                    fotos.forEach((foto, index) => {
                        const nombreFoto = newProduct.thumbnails[index].replace(/ /g, '')

                        fs.writeFile(`${config.paths.multer}${nombreFoto}`, foto, (err) => {
                            if (err) {
                                throw new Error('Error al guardar la imagen:', err)
                            } else {
                                console.log(`Imagen ${nombreFoto} guardada exitosamente.`)
                            }
                        })
                    })
                }

                //Obtener la lista actualizada y enviarla a TODOS los clientes
                const updatedProducts = await productsManager.getProducts();

                socket.emit('productsList', updatedProducts);

                callback({ status: 'ok', message: 'Producto agregado correctamente' })

            } catch (error) {
                callback({ status: 'error', message: error.message })

            }


        })

        socket.on('deleteProduct', async (id) => {

            try {

                await productsManager.deleteProduct(id)

                const updatedProducts = await productsManager.getProducts();
                socket.emit('productsList', updatedProducts);

            } catch (error) {
                socket.emit('error', { message: `${error.message}` });
            }
        })

        socket.on('disconnect', (data) => {
            console.log(data, socket.id, 'desconectado')
        })
    })
}
