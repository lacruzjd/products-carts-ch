import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const config = {
      PORT: 8080,
      paths: {
      db: path.join(__dirname, '../db'),
      public: path.join(__dirname, '../../public'),
      multer: path.join(__dirname, '../uploads'),
      hbs: {
         views: path.join(__dirname, '../views'),
         layouts: path.join(__dirname, '../views/layouts'),
         pages: path.join(__dirname, '../views/pages')
      },
      products: {
         image: path.join(__dirname, '../uploads/products/images')
      }
   },

}
