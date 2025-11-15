export default class User {
  constructor({ first_name, last_name, email, age, role }) {
    if (!first_name || !last_name || !email || !age ) {
      throw new Error('Todos los campos son obligatorios')
    }

    if (isNaN(Number(age))) {
      throw new Error('El dato del precio o el stock deben ser numerico')
    }

    this.first_name = first_name
    this.last_name = last_name
    this.email = email
    this.age = parseInt(age)
    this.role = role || 'user'
  }
}
