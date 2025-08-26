import express from 'express'
import fs from 'fs/promises'
import crypto from 'crypto'
import { error } from 'console'

const server = express()
const PORT = 8080

server.use(express.json());

//Clase para gestionar los productos
export class ProductManager {
    constructor(pathProducts) {
        this.pathProducts = pathProducts
        this.products = []
    }

    async #readFile() {
        try {
            const data = await fs.readFile(this.pathProducts, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            throw new Error(`Ocurrio un error al leer archivo: ${error}`)
        }
    }

    async #writeFile(data) {
        try {
            await fs.writeFile(this.pathProducts, JSON.stringify(data, null, 2))
        } catch (error) {
            throw new Error(`Ocurrio un error al guardar datos en el archivo: ${error}`)
        }
    }

    async addProducts(product) {
        try {
            const productValues = {
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status,
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails
            }

            const productIncompleto = Object.values(productValues).some(value => value === undefined || value === null || value === ' ')

            if (productIncompleto) {
                throw new Error(`Faltan datos, todos los campos son obligatorios`)
            }

            this.products = await this.#readFile()

            if (this.products.some(p => p.code === productValues.code)) {
                throw new Error(`Codigo de producto duplicado.`)
            }

            const productoToSave = { id: crypto.randomUUID(), ...productValues }

            this.products.push(productoToSave)

            await this.#writeFile(this.products)

        } catch (error) {
            throw new Error(`Ocurrio un error al guardar el producto. ${error}`)
        } finally {
            this.products = []
        }
    }

    async getProducts() {
        try {
            this.products = await this.#readFile()
            return this.products
        } catch (error) {
            throw new Error(`Ocurrio un error al obtener lista de productos`)
        } finally {
            this.products = []
        }
    }

    async getProductById(id) {
        try {
            this.products = await this.#readFile()
            const productId = this.products.find(p => p.id === id)

            if (!productId) {
                throw new Error(`Not found`)
            }

            return productId
        } catch (error) {
            throw new Error('Producto no encontrado')
        } finally {
            this.products = []
        }
    }

    async updateProduct(id, product) {
        try {
            this.products = await this.#readFile()
            const productToUpdate = this.products.find(p => p.id === id)

            if (productToUpdate) {
                Object.keys(await product).forEach(k => {
                    if (k !== productToUpdate[k]) {
                        productToUpdate[k] = product[k]
                    }
                })

                await this.#writeFile(this.products)
            } else {
                throw new Error(`Producto no encontrado: ${error.message}`)
            }

        } catch (error) {
            throw new Error(error.message)
        } finally {
            this.products = []
        }

    }

    async deleteProduct(id) {
        try {
            this.products = await this.#readFile()
            const product = this.products.some(p => p.id === id)

            if (product) {
                this.products = this.products.filter(p => p.id !== id)
                await this.#writeFile(this.products)
            } else {
                throw new Error(`Producto no encontrado`)
            }

        } catch (error) {
            throw new Error(`Error al eliminar producto ${error} `)
        } finally {
            this.products = []
        }
    }
}

// Clase para gestionar los carros de compra
class CartManager {
    constructor(path) {
        this.carts = []
        this.pathCart = path
    }

    async #readFile() {
        try {
            let data = await fs.readFile(this.pathCart, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            throw new Error(`Archivo no encontrado: ${error.message}`)
        }
    }

    async #writeFIle(data) {
        try {
            await fs.writeFile(this.pathCart, JSON.stringify(data, null, 2))
        } catch (error) {
            throw new Error(`Error al escribir en archivo: ${error.message}`)
        }
    }

    async createCart() {
        try {
            this.carts = await this.#readFile()
            this.carts.push({ id: crypto.randomUUID(), products: [] })
            await this.#writeFIle(this.carts)
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.mensaje}`)
        } finally {
            this.carts = []
        }
    }

    async getCartById(id) {
        try {
            this.carts = await this.#readFile(this.pathCart)
            const cart = await this.carts.find(c => c.id === id)

            if (!cart) {
                throw new Error('Carrito no encontrado')
            }

            return cart
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`)
        } finally {
            this.carts = []
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            this.carts = await this.#readFile()
            const cart = await this.carts.find(c => c.id === cartId)
            const product = await productManager.getProductById(productId)
            
            if (cart && product) {
                console.log(product)
                if (!cart.products.some(p => p.product === productId)) {
                    cart.products.push({ product: productId, quantity: 1 })
                } else {
                    const product = cart.products.find(p => p.product === productId)
                    product.quantity = product.quantity + 1
                    console.log(product)
                }

                this.#writeFIle(this.carts)
            } else {
                throw new Error('Carrito o Producto no encontrado')
            }

        } catch (error) {
            throw new Error(`Error al agregar producto ${error}`)
        } finally {
            this.carts = []
        }
    }
}

// Ruta para la persiencia de productos
const pathProducts = 'products.json'

// Instancia para manejar los products
const productManager = new ProductManager(pathProducts)

// Endpoints de products
server.get('/api/products/', async (req, res) => {
    try {
        res.json(await productManager.getProducts())
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

server.get('/api/products/:pid', async (req, res) => {
    const { pid } = req.params

    try {
        res.status(200).json(await productManager.getProductById(pid))
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

server.post('/api/products/', async (req, res) => {
    const dataToAdd = req.body

    try {
        await productManager.addProducts(dataToAdd)
        res.status(201).json({ mensaje: 'Producto agregado con exito' })
    } catch (error) {
        res.status(409).json({ mensaje: error.message })
    }
})

server.put('/api/products/:pid', async (req, res) => {
    const { pid } = req.params
    const dataToUpdate = req.body

    try {
        await productManager.updateProduct(pid, dataToUpdate)
        res.status(200).json({ mensaje: 'Actualizado' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

server.delete('/api/products/:pid', async (req, res) => {
    const { pid } = req.params

    try {
        await productManager.deleteProduct(pid)
        res.status(200).json({ mensaje: 'Producto Eliminado' })
    } catch (error) {
        res.status(404).json({ error: error.message })

    }
})

// Ruta del archivo para la persistencia de los datos de los carritos de compras
const pathcarts = 'carts.json'

// Instancia para gestionar los carritos de compras
const cartManager = new CartManager(pathcarts)

// Endpoints para los carritos de compras

server.post('/api/carts/', async (req, res) => {
    try {
        await cartManager.createCart()
        res.status(201).json({ mensaje: 'Carrito creado con exito' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

server.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const products = await cartManager.getCartById(cid)
        res.status(200).json(products.products)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

server.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params

    try {
        await cartManager.addProductToCart(cid, pid)
        res.status(201).json({ mensaje: 'Producto agreagdo al carrito' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})


server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})