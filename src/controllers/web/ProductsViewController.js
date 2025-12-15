export default class ProductsViewController {

    constructor(productservice) {
        this.productservice = productservice
    }

    async getProducts(req, res) {
        try {
            const { page, limit, category, order_price } = req.query
            
            let result = await this.productservice.getProducts(page, limit, category, order_price)

            const user = req.user || null
            let admin = false
            if(user && user.role === 'admin') {
                admin = true
            }
            const categorias = await this.productservice.getCategoriesProducts('category')

            res.render('index', {
                title: 'Products & Carts',
                products: result.docs,
                currentPage: result.page,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                categorias,
                user,
                admin 
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
            res.render('productdetail', {
                title: 'Detalle Producto',
                product,
            })
        } catch (error) {
            throw new Error(`Error al obtener detalles de los  productos: ${error.message}`);

        }

    }
}
