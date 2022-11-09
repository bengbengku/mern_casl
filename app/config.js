const dotenv = require('dotenv')
const path = require('path')
dotenv.config()

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  secretKey: process.env.SECRET_KEY,
  serviceName: process.env.SERVICE_NAME,
  dbUrl: process.env.URL,
}
