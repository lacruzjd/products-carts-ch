import ProductService from "../services/ProductService.js"

//socket para manejar productos servidor
export default function socketServer(io) {
    io.on('connection', async socket => {
        console.log(`socket id: ${socket.id} conectado`)

        socket.emit('productsList', await ProductService.getAllProducts())

        socket.on('newProduct', async (datos, callback) => {
            try {
                await ProductService.createProduct(datos)

                const updatedProducts = await ProductService.getAllProducts()
                socket.emit('productsList', updatedProducts);

                callback({ status: 'ok', message: 'Producto agregado correctamente' })

            } catch (error) {
                callback({ status: 'error', message: error.message })
            }
        })

        socket.on('deleteProduct', async (id) => {
            try {
                await ProductService.deleteProduct(id)

                const updatedProducts = await ProductService.getAllProducts()
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
