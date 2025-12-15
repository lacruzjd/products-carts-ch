import { config } from '../config/config.js'

let UserDao
let ProductDao
let CartDao

console.log(`Usando persistencia: ${config.persistence}`)

switch (config.persistence) {
    case 'MONGO':
        // Usamos import() dinámico para cargar solo los módulos necesarios.
        const { default: UserMongoDAO } = await import('./mongo/UserMongoDAO.js')
        const { default: ProductMongoDAO } = await import('./mongo/ProductMongoDAO.js')
        const { default: CartMongoDAO } = await import('./mongo/CartMongoDAO.js')
        
        UserDao = UserMongoDAO
        ProductDao = ProductMongoDAO
        CartDao = CartMongoDAO
        break

    case 'FILE':
        // Aquí importarías tus DAOs de PostgreSQL cuando los tengas.
        const { default: UserPostgresDAO } = await import('./postgres/UserPostgresDAO.js')
        UserDao = UserPostgresDAO
        // ProductDao = ...
        // CartDao = ...
        break

    // Puedes añadir más casos para 'FILE', 'MEMORY', etc.
}

export { UserDao, ProductDao, CartDao }
