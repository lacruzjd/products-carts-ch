import CartManager from "../../managers/carts.manager.js"
import PersistenciaArchivoJson from "../../services/PersistenciaArchivoJson.js"
import path from 'path'
import { config } from "../../config/config.js"

// Ruta del archivo para la persistencia de los datos de los carritos de compras
const pathcarts = path.join(config.paths.db, 'carts.json')

const persistencia = new PersistenciaArchivoJson(pathcarts)
const cartManager = new CartManager(persistencia)

export const getCarts = async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts()
        res.status(200).json(carts)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const createCart = async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(201).json({ mensaje: 'Carrito creado con exito', id: newCart.id })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const gerCartById = async (req, res) => {
    const { cid } = req.params

    try {
        const productsInCart = await cartManager.getCartById(cid)
        res.status(200).json(productsInCart.products)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params

    try {
        await cartManager.addProductToCart(cid, pid)
        res.status(201).json({ mensaje: 'Producto agreagdo al carrito' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deleteCart = async (req, res) => {
    const { cid } = req.params

    try {
        await cartManager.deleteCart(cid)
        res.status(201).json({ mensaje: 'Carrito Eliminado' })
    } catch (error) {
        res.status(404).json({ mensaje: error.message })
    }
}