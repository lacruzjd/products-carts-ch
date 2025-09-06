export default class User {
  constructor({id, nombre, apellido, email, password, role = 'buyer' }) {

    if (!nombre || !apellido || !email || !password) {
      throw new Error('Nombre, apellido, email y contraseña son obligatorios')
    }

    const validRoles = ['buyer', 'admin']
    if (!validRoles.includes(role)) {
      throw new Error(`Rol inválido. Debe ser uno de: ${validRoles.join(', ')}`)
    }

    this.id = id
    this.nombre = nombre
    this.apellido = apellido
    this.email = email
    this.password = password 
    this.createdAt = new Date()
    this.role = role
  }

  isAdmin() {
    return this.role === 'admin'
  }

  isBuyer() {
    return this.role === 'buyer'
  }
}