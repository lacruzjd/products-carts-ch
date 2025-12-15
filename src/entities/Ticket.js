export default class Ticket {

  constructor(numTicket, datetime, user, status, products, totalPrice) {
    // if (!datetime || !user || !status || !products || !totalPrice) {
    //   throw new Error('Todos los campos son obligatorios para el ticket')
    // }

    // if (isNaN(Number(totalPrice))) {
    //   throw new Error('El monto debe ser un valor numérico')
    // }
    this.numTicket = numTicket
    this.datetime = datetime
    this.user = user
    this.status = status
    this.products = products
    this.totalPrice = totalPrice
  }
}