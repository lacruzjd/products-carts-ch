import CartService from "../../services/CartService.js"

export const getCarts = async (req, res) => {
    try {
        const carts = await CartService.getAllCarts()
        res.status(200).json(carts)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const createCart = async (req, res) => {
    try {
        const newCart = await CartService.createCart()
        res.status(201).json({ mensaje: 'Carrito creado con exito', id: newCart })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const getCartById = async (req, res) => {
    const { cid } = req.params

    try {
        const productsInCart = await CartService.getCartById(cid)
        res.status(200).json(productsInCart.products)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params
    
    try {
        await CartService.addProductToCart(cid, pid)
        res.status(201).json({ mensaje: 'Producto agreagdo al carrito' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deteleProductCart = async (req, res) => {
    const { cid, pid } = req.params
 try {
        await CartService.deteleProductCart(cid, pid)
        res.status(201).json({ mensaje: 'Producto eliminado del carrito' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deteleProductscart = async (req, res) => {
    const {cid} = req.params
    
    try {
        await CartService.deteleProductscart(cid)
        res.status(201).json({ mensaje: 'Productos eliminados del carrito' })
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