import express from 'express'
import multer from 'multer'
import path from 'path'
import Converter from './converter.js'
import MetaData from './metaData.js'
import FileHandler from './handlers.js'

/**
 * Server class to handle file conversion and metadata operations.
 */
class Server {
  /**
   * Initializes a new instance of the Server class.
   */
  constructor () {
    this.app = express()
    this.configureMiddleware()
    this.upload = this.configureMulter()
    this.converter = new Converter()
    this.metaData = new MetaData()
    this.fileHandler = new FileHandler(this.converter, this.metaData)
    this.setupRoutes()
  }

  /**
   * Configures middleware for the Express app.
   */
  configureMiddleware () {
    this.app.use(express.json({ limit: '100mb' }))
    this.app.use(express.urlencoded({ limit: '100mb', extended: true }))
  }

  /**
   * Configures Multer for file uploads.
   *
   * @returns {Object} - The configured Multer instance.
   */
  configureMulter () {
    const storage = multer.diskStorage({
      destination: this.setUploadDestination,
      filename: this.setUploadFilename
    })
    return multer({ storage })
  }

  /**
   * Sets the upload destination for Multer.
   *
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function.
   */
  setUploadDestination (req, file, cb) {
    cb(null, 'uploads/')
  }

  /**
   * Sets the upload filename for Multer.
   *
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function.
   */
  setUploadFilename (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${Date.now()}${ext}`)
  }

  /**
   * Sets up the routes for the Express app.
   */
  setupRoutes () {
    this.app.get('/', this.handleRootRequest)
    this.app.post('/convert', this.upload.single('file'), this.fileHandler.handleFileConversion.bind(this.fileHandler))
    this.app.post('/metadata', this.upload.single('file'), this.fileHandler.handleFileMetadata.bind(this.fileHandler))
    this.app.post('/stereoToSurround', this.upload.single('file'), this.fileHandler.handleStereoToSurround.bind(this.fileHandler))
    this.app.post('/resize', this.upload.single('file'), this.fileHandler.handleResizeVideo.bind(this.fileHandler))
    this.app.post('/removeaudio', this.upload.single('file'), this.fileHandler.handleRemoveAudio.bind(this.fileHandler))
  }

  /**
   * Handles the root request.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  handleRootRequest (req, res) {
    res.send('Welcome to the MP4 to MP3 conversion API. Use POST /convert to upload a file.')
  }

  /**
   * Starts the server on the specified port.
   *
   * @param {number} port - The port number to start the server on.
   */
  startServer (port) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
}

export default Server
