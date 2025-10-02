import ProductModel from "../../models/productModel.js"

export default class ProductsViewController {

    constructor(productservice, cartService) {
        this.productservice = productservice
        this.cartService = cartService
    }

    async getProducts(req, res) {
        try {
            const { page = 1, limit = 10, category, order_price } = req.query

            const filtro = {
            }

            if (category) filtro.category = category

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { price: order_price === 'desc' ? -1 : 1 },
                lean: true,
                leanWithId: true
            }

            let result = await ProductModel.paginate(filtro, options)
            const cartId = await this.cartService.createCart()
            const categorias = await ProductModel.distinct('category')

            res.render('index', {
                title: 'Products & Carts',
                products: result.docs,
                currentPage: result.page,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                cartId: cartId._id.toString(),
                categorias
            })
        } catch (error) {
            throw new Error(`Error al cargar productos: ${error.message}`);

        }

    }

    async getRealTimeProducts(req, res) {
        res.render('realTimeProducts', {
            title: 'Agregar Producto'
        })
    }

    async productDetail(req, res) {
        try {
            const { pid } = req.params
            const product = await this.productservice.getProductById(pid)
            const cartId = await this.cartService.getCarts()
            res.render('productdetail', {
                title: 'Detalle Producto',
                product,
                cartId: cartId[0]._id
            })
        } catch (error) {
            throw new Error(`Error al obtener detalles de los  productos: ${error.message}`);

        }

    }
}
