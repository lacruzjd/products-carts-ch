import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const config = {
   PORT: process.env.PORT,
   dataBase: {
      mongoDb: process.env.MONGO_URI,
   },
   paths: {
      db: path.join(__dirname, '../db'),
      public: path.join(__dirname, '../../public'),
      multer: path.join(__dirname, '../uploads'),
      upload: path.join(__dirname, '../uploads'),
      hbs: {
         views: path.join(__dirname, '../views'),
         layouts: path.join(__dirname, '../views/layouts'),
         pages: path.join(__dirname, '../views/pages')
      },
      products: {
         imageStorage: path.join(__dirname, '../uploads/products/img/'),
         imageUrl: path.join('/products/img/')
      }
   },

}
