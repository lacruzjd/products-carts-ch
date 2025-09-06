export default class Product {
  constructor({ id, title, description, code, price, status, stock, category, thumbnails }) {
    if (!id || !title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
      throw new Error('Todos los campos son obligatorios')
    }

    this.id = id
    this.title = title
    this.description = description
    this.code = code
    this.price = price
    this.status = status
    this.stock = stock
    this.category = category
    this.thumbnails = thumbnails
  }
}
