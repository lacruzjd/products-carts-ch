import multer from 'multer'
import path from 'path'
import { config } from '../../config/config.js'

// Configuración de Multer
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(config.paths.multer, 'products', 'img'))
    },
    filename: (req, file, cb) => {
        const name = file.originalname.replace(/\s+/g, '')
        cb(null, name);
    }
});

const upload = multer({ storage: storageConfig }).array('fotos', 2)

export default class ProductController {
    constructor(productService) {
        this.productService = productService
    }

    async addProducts(req, res) {
        upload(req, res, async (err) => {
            try {
                const newProduct = req.body
                const fotos = req.files

                if (!newProduct || !fotos || fotos.length === 0) {
                    return res.status(400).json({ message: 'Error: Faltan datos del producto o archivos.' })
                }

                const productSaved = await this.productService.createProduct({ newProduct, fotos })
                return res.status(201).json({ message: 'Producto agregado con exito.', pid: productSaved.id })

            } catch (error) {
                return res.status(409).json({ message: error.message })
            }
        })
    }

    async getProducts(req, res) {
        try { 
            const { page, limit, category, order_price } = req.query

            const products = await this.productService.getProducts(page, limit, category, order_price)

            return res.status(200).json(products)
        } catch (error) {
            return res.status(500).json({ message: `Ocurrió un error al obtener los productos. ${error.message}` })
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params

            const product = await this.productService.getProductById(pid)
            return res.status(200).json(product)
        } catch (error) {
            // El servicio lanza un error si no lo encuentra, así que enviamos 404
            return res.status(404).json({ message: error.message })
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params
            const dataToUpdate = req.body

            if (!dataToUpdate) throw new Error('No hay datos para actualizar')

            await this.productService.updateProduct(pid, dataToUpdate);
            return res.status(200).json({ message: 'Producto actualizado exitosamente.' })
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params
            await this.productService.deleteProduct(pid);
            return res.status(200).json({ message: 'Producto eliminado exitosamente.' })
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}
