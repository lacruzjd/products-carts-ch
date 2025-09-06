import express from 'express'
import ProductManager from '../../managers/products.manager.js';

const viewRoutes = express.Router()

// Ruta de ejemplo
viewRoutes.get('/', async (req, res) => {
  const products = await new ProductManager().getProducts()
  res.render('home', {
    title: 'Products & Carts',
    products
  });
});

export default viewRoutes


