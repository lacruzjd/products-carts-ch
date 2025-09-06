export default class Cart {
  constructor(id) {
    this.id = id
    this.products = [] // Cada producto tendrá: { productId, quantity }
  }

  addProduct(productId, quantity = 1) {
    if (!productId || quantity <= 0) {
      throw new Error('Producto inválido o cantidad no válida')
    }

    const existing = this.products.find(p => p.productId === productId)

    if (existing) {
      existing.quantity += quantity
    } else {
      this.products.push({ productId, quantity })
    }
  }

  removeProduct(productId) {
    const index = this.products.findIndex(p => p.productId === productId)
    if (index === -1) {
      throw new Error('Producto no encontrado en el carrito')
    }
    this.products.splice(index, 1)
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      throw new Error('Cantidad debe ser mayor a cero')
    }

    const product = this.products.find(p => p.productId === productId)
    if (!product) {
      throw new Error('Producto no encontrado en el carrito')
    }

    product.quantity = quantity
  }

  clearCart() {
    this.products = []
  }

  getItems() {
    return this.products
  }
}

