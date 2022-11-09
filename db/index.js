const mongoose = require('mongoose')
const { dbUrl } = require('../app/config')
mongoose.connect(`${dbUrl}`)
const db = mongoose.connection

module.exports = db
