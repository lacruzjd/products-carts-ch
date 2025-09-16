export default class Product {

  constructor({ id, title, description, code, price, stock, category, thumbnails }) {
    if (!id || !title || !description || !code || !price || !stock || !category || !thumbnails) {
      throw new Error('Todos los campos son obligatorios')
    }

    if (isNaN(Number(price)) || isNaN(Number(stock))) {
      throw new Error('El dato del precio o el stock deben ser numerico')
    }

    this.id = id
    this.title = title
    this.description = description
    this.code = code
    this.price = parseFloat(price)
    this.stock = parseInt(stock)
    this.category = category
    this.thumbnails = thumbnails
  }
}
