import express from 'express';
import { engine } from 'express-handlebars';
import { config } from './src/config/config.js';
import apiRoutes from './src/routes/api/index.js';

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(config.paths.public))
app.use('/products/img', express.static(config.paths.products.image))

// Configurar Handlebars como motor de vistas
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', config.paths.hbs.views)

//Api 
app.use('/api', apiRoutes)

//views
app.use('/', webRoutes)


import multer from 'multer';
import webRoutes from './src/routes/web/index.js';
const storageCOnfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.paths.multer)
  },
  filename: (req, file, cb) => {
    const name = file.originalname
    cb(null, name)
  }
})

const upload = multer({storage: storageCOnfig})

app.post('/products/add', upload.array('fotos', 2), (req, res) => {
  console.log(req.files, req.body)
try {
  res.status(201).send("imagen Subida")
} catch (error) {
  res.status(404).send("fallo la subida del archivo")
}
})

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});