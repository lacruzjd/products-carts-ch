import { config } from "../config/config.js"
import fs from 'fs/promises'
import path from "path"

export default class StorageService {

    static imagenDestino = config.paths.products.imageStorage

    static async saveImages(data) {
        const { fotos, nombresImagenes } = data
        const urlImagenes = []
        const url = config.paths.products.imageUrl

        if (fotos && fotos.length > 0) {
            fotos.forEach((foto, index) => {
                let nombreImagen

                if (nombresImagenes && nombresImagenes.length > 0) {
                    nombreImagen = nombresImagenes[index].replace(/ /g, '')

                    try {
                        fs.writeFile(`${imagenDestino}${nombreImagen}`, foto)
                    } catch (error) {
                        throw new Error('Error al guardar imagen')
                    }

                    urlImagenes.push(`${url}${nombreImagen}`)
                } else {
                    if (foto.originalname) {
                        nombreImagen = foto.originalname.replace(/ /g, '')
                        urlImagenes.push(`/products/img/${nombreImagen}`)
                    }
                }
            })
        }
        return urlImagenes
    }

    static async deleteImages(imagesPath) {
        console.log(imagesPath)
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