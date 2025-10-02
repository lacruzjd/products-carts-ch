import { config } from "../config/config.js"
import fs from 'fs/promises'
import path from "path"

export default class StorageService {
    constructor(pathDestino, pathUrlImage){
        this.pathDestino = pathDestino
        this.pathUrlImage = pathUrlImage
    }

    async saveImages(data) {
        const { fotos, nombresImagenes } = data
        const pathUrlImagenes = []

        if (fotos && fotos.length > 0) {
            fotos.forEach((foto, index) => {
                let nombreImagen

                if (nombresImagenes && nombresImagenes.length > 0) {
                    nombreImagen = nombresImagenes[index].replace(/ /g, '')

                    try {
                        fs.writeFile(`${this.pathDestino}${nombreImagen}`, foto)
                    } catch (error) {
                        throw new Error('Error al guardar imagen')
                    }

                    pathUrlImagenes.push(`${this.pathUrlImage}${nombreImagen}`)
                } else {
                    if (foto.originalname) {
                        nombreImagen = foto.originalname.replace(/ /g, '')
                        pathUrlImagenes.push(`${this.pathUrlImage}${nombreImagen}`)
                    }
                }
            })
        }
        return pathUrlImagenes
    }

    async deleteImages(imagesPath) {
        if (imagesPath.length > 0) {
           imagesPath.forEach(foto => {
                try {
                    fs.unlink(path.join(config.paths.upload, foto))
                } catch (error) {
                    throw new Error(`Error al eliminar imagen: ${error.message}`)
                }
            })
        }

    }
}