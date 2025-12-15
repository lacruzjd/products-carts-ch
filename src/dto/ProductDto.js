export default class ProductDto {
  constructor({ title, price, thumbnails}) {


    this.title = title
    this.price = parseFloat(price)
    this.thumbnails = thumbnails
  }
}
