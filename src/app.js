import express from 'express'
import { engine } from 'express-handlebars'
import { config } from './config/config.js'
import webRoutes from './routes/web/index.js'
import apiRoutes from './routes/api/index.js'
import http from 'http'
import { Server } from 'socket.io'
import socket from './socket/socketServer.js'
import initializePassport from './config/passportConfig.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import mongoStore from 'connect-mongo'
import mongodbConnect from './config/mongodbConnect.js'
import cors from 'cors'
import { errorHandler } from './middlerwares/errorHandler.js'

const app = express()
const server = http.createServer(app)
app.use(cors())

// Conexion a Mongo Atlas
mongodbConnect('Atlas')

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

//session
app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create(
        {
            mongoUrl: config.dataBase.mongoDbAtlas,
            ttl: 60 * 60,
            autoRemove: 'native'
        }
    )
}))

//passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser(process.env.COOKIE_SECRET))

//Api 
app.use('/api', apiRoutes)

//Views
app.use('/', webRoutes)

app.use(errorHandler)


export { app, server }