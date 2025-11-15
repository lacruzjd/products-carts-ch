import bcrypt from 'bcrypt'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = async (password, userPassword) =>  bcrypt.compareSync(password, userPassword)
