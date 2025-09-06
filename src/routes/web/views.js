import express from 'express'
import ProductManager from '../../managers/products.manager.js';
import UserManager from '../../managers/users.manager.js';

const viewRoutes = express.Router()

// Ruta de ejemplo
viewRoutes.get('/', async (req, res) => {
  const products = await new ProductManager().getProducts()
  res.render('home', {
    title: 'Products & Carts',
    products
  });
});

viewRoutes.get('/login', async (req, res) => {
  res.render('pages/login', {
    title: 'Login'
  })
})

viewRoutes.get('/registro', async (req, res) => {
  res.render('pages/registro');
});

viewRoutes.post('/login', async (req, res) => {
  const {email, password} = req.body
  const authenticated = await new UserManager().auntenticaUser(email, password)
  if(authenticated) {
    res.render('home', {products: await new ProductManager().getProducts(), nombre: 'CO:O'})
  }
})

export default viewRoutes


