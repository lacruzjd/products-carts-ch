import ProductManager from "../../managers/products.manager.js"

const productManager = new ProductManager()

export const getProducts = async (req, res) => {
    try {
        res.json(await productManager.getProducts())
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const getProductById = async (req, res) => {
    const { pid } = req.params

    try {
        res.status(200).json(await productManager.getProductById(pid))
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const addProducts = async (req, res) => {
    const dataToAdd = req.body

    try {
        await productManager.addProducts(dataToAdd)
        res.status(201).json({ mensaje: 'Producto agregado con exito' })
    } catch (error) {
        res.status(409).json({ mensaje: error.message })
    }
}

export const updateProduct = async (req, res) => {
    const { pid } = req.params
    const dataToUpdate = req.body

    try {
        await productManager.updateProduct(pid, dataToUpdate)
        res.status(200).json({ mensaje: 'Actualizado' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    const { pid } = req.params

    try {
        await productManager.deleteProduct(pid)
        res.status(200).json({ mensaje: 'Producto Eliminado' })
    } catch (error) {
        res.status(404).json({ error: error.message })

    }
}