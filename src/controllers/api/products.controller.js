import multer from 'multer'
import path from 'path'
import { config } from '../../config/config.js';
import ProductManager from "../../managers/products.manager.js"
import PersienciaArchivoJson from '../../services/PersistenciaArchivoJson.js';

// // MULTER
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

// Ruta para la persiencia de productos
const pathProducts = path.join(config.paths.db, 'products.json')
const persistencia = new PersienciaArchivoJson(pathProducts)
const productManager = new ProductManager(persistencia)

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
    upload(req, res, async (err) => {

        if (err) {
            throw new Error(err)
        }

        req.body.thumbnails = []

        try {
            if (req.files) {
                req.body.thumbnails = req.files.map(file => file.filename)
            }
            console.log('controller', req.body)
            await productManager.addProducts(req.body)

            // Guardado de Imagenes 
            if (req.files) {

                try {
                    await persistencia.saveImages(req.files)
                } catch (error) {
                    throw new Error(`Error al guardar imagen: ${error.message}`)
                }
            }


            res.status(201).json({ mensaje: 'Producto agregado con exito' })
        } catch (error) {
            res.status(409).json({ mensaje: error.message })

        }

        if (err) {
            return res.status(500).json({ error: 'Error al subir archivo' });
        }


    })
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