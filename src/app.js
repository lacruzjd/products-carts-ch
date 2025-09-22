import express from 'express'
import { engine } from 'express-handlebars'
import { config } from './config/config.js'
import webRoutes from './routes/web/index.js'
import apiRoutes from './routes/api/index.js'
import http from 'http'
import { Server } from 'socket.io'
import socket from './socket/socketServer.js'

const app = express();
const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(config.paths.public))
app.use('/products/img', express.static(config.paths.products.imageStorage))

// Configurar Handlebars como motor de vistas
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', config.paths.hbs.views)

//Configurar socket
const io = new Server(server, {
    maxHttpBufferSize: 1e7, // Aumenta el límite a 10 MB
    cors: {
        origin: '*', // o tu dominio específico
        methods: ['GET', 'POST']
    }
});

socket(io)

//Api 
app.use('/api', apiRoutes)

//views
app.use('/', webRoutes)


export { app, server }