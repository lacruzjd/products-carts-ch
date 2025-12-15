import TicketModel from '../../models/mongoose/TicketModel.js'
import MongoDAO from './MongoDAO.js'

export default class TicketMongoDAO extends MongoDAO {
    constructor() {
        super(TicketModel)
    }

}