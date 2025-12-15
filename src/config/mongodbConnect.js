import mongoose from "mongoose"
import { config } from "./config.js"

export default function connectToMongoAtals(server) {

    if(server !== 'Atlas' && server !== 'Compass') {
        throw new Error('Servidores disponibles: Atlas o Compass')
    } 

    if (server === 'Atlas') {
        try {
            mongoose.connect(config.dataBase.mongoDbAtlas)
            console.log('Conectado a Mongo Atlas')
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            throw new Error('No hay base de datos Mongo Compass Configurada')
        } catch (error) {
            console.log(error)
        }
    }
}