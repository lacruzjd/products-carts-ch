import multer from 'multer'
import path from 'path'
import { config } from '../../config/config.js';
import ProductService from '../../services/ProductService.js';

// MULTER
const storageCOnfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(config.paths.multer, 'products', 'img'))
    },
    filename: (req, file, cb) => {
        const name = file.originalname.replace(/\s+/g, '');
        cb(null, name)
    }
})

const upload = multer({ storage: storageCOnfig }).array('fotos', 2)

export const addProducts = async (req, res) => {
    upload(req, res, async (err) => {
        try {
            await ProductService.createProduct({ newProduct: req.body, fotos: req.files})
            res.status(201).json({ mensaje: 'Producto agregado con exito' })
        } catch (error) {
            res.status(409).json({ mensaje: error.message })
        }

        if (err) {
            return res.status(500).json({ error: 'Error al subir archivo' });
        }

    })
}

export const getProducts = async (req, res) => {
    try {
        const products = await ProductService.getAllProducts()
        
        res.status(200).json(products)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const getProductById = async (req, res) => {
    const { pid } = req.params
 
    try {
        res.status(200).json(await ProductService.getProductsById(pid))
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const updateProduct = async (req, res) => {
    const { pid } = req.params
    const dataToUpdate = req.body
    try {
        await ProductService.updateProducts(pid, dataToUpdate)
        res.status(200).json({ mensaje: 'Actualizado' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    const { pid } = req.params

    try {
        await ProductService.deleteProduct(pid)
        res.status(200).json({ mensaje: 'Producto Eliminado' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}