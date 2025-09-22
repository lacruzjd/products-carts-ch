import ProductService from "../../services/ProductService.js"

export const getProducts = async (req, res) => {
    const products = await ProductService.getAllProducts()
    res.render('home', {
        title: 'Products & Carts',
        products
    })
}

export const getRealTimeProducts = async (req, res) => {
  res.render('realTimeProducts', {
    title: 'Agregar Producto'
  })
}

export const productDetail = async (req, res) => {
  const {pid} = req.params
  const product = await ProductService.getProductsById(pid)
  res.render('productdetail', {
    title: 'Detalle Producto',
    product
  })
}
