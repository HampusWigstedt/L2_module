import Server from './server.js'
import Converter from './converter.js'
import MetaData from './metaData.js'

// Create an instance of the converter and start the server
const converter = new Converter()
const server = new Server()
server.startServer(3000)