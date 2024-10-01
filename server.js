import express from 'express'
import multer from 'multer'
import path from 'path'
import Converter from './converter.js'
import MetaData from './metaData.js'
import FileHandler from './handlers.js'

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${Date.now()}${ext}`)
    }
})

const upload = multer({ storage: storage })

class Server {
    constructor() {
        this.app = express()
        this.app.use(express.json({ limit: '100mb' }))
        this.app.use(express.urlencoded({ limit: '100mb', extended: true }))
        this.upload = upload
        this.converter = new Converter()
        this.metaData = new MetaData()
        this.fileHandler = new FileHandler(this.converter, this.metaData)
        this.setupRoutes()
    }

    setupRoutes() {
        this.app.get('/', this.handleRootRequest.bind(this))
        this.app.post('/convert', this.upload.single('file'), this.fileHandler.handleFileConversion.bind(this.fileHandler))
        this.app.post('/metadata', this.upload.single('file'), this.fileHandler.handleFileMetadata.bind(this.fileHandler))
        this.app.post('/StereoToSurround', this.upload.single('file'), this.fileHandler.handleStereoToSurround.bind(this.fileHandler))
        this.app.post('/resize', this.upload.single('file'), this.fileHandler.handleResizeVideo.bind(this.fileHandler))
        this.app.post('/removeaudio', this.upload.single('file'), this.fileHandler.handleRemoveAudio.bind(this.fileHandler))
    }

    handleRootRequest(req, res) {
        res.send('Welcome to the MP4 to MP3 conversion API. Use POST /convert to upload a file.')
    }

    startServer(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    }
}

export default Server