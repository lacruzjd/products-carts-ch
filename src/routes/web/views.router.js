import express from 'express'
import ProductManager from '../../managers/products.manager.js';
import PersistenciaArchivoJson from '../../services/PersistenciaArchivoJson.js';
import { config } from '../../config/config.js';
import path from 'path'

// import multer from 'multer';
// import path from 'path'
// import { config } from '../../config/config.js';

const viewRoutes = express.Router()

// MULTER
// const storageCOnfig = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(config.paths.multer,'products', 'img'))
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname
//     cb(null, name)
//   }
// })

const pathProducts = path.join(config.paths.db, 'products.json')
const persiencia = new PersistenciaArchivoJson(pathProducts)
const productsManager = new ProductManager(persiencia)

viewRoutes.get('/', async (req, res) => {
  const products = await productsManager.getProducts()
  console.log(products)
  res.render('home', {
    title: 'Products & Carts',
    products
  })
})

viewRoutes.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', {
    title: 'Agregar Producto'
  })
})

// const upload = multer({storage: storageCOnfig})

// const productManager = new ProductManager()

// viewRoutes.post('/products-add', upload.array('fotos', 2), async (req, res) => {

//   req.body.thumbnails= req.files.map(name => `/products/img/${name.filename}`)
//   try {

//   await productManager.addProducts(req.body)
//   res.status(201).send("imagen Subida")

// } catch (error) {
//   res.status(404).send(`fallo la subida del archivo ${error.message}`)
// }
// })

export default viewRoutes


