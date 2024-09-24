// Necessary modules
import express from 'express'
import multer from 'multer'
import path from 'path'
import Converter from './converter.js'

class Server {
    constructor() {
        this.app = express()
        this.upload = multer({ dest: 'uploads/' })
        this.setupRoutes()
    }

    setupRoutes() {
        this.app.get('/', this.handleRootRequest.bind(this));
        this.app.post('/convert', this.upload.single('file'), this.handleFileConversion.bind(this))
    }

    handleRootRequest(req, res) {
        res.send('Welcome to the MP4 to MP3 conversion API. Use POST /convert to upload a file.')
    }

    handleFileConversion(req, res) {
        const filePath = req.file.path;
        const outputFilePath = path.join('uploads', `${req.file.filename}.mp3`)

        console.log(`Starting conversion of ${filePath} to ${outputFilePath}`)

        Converter.convertToMP3(
            filePath,
            outputFilePath,
            (progress) => {
                console.log(`Processing: ${progress.percent}% done`)
            },
            (outputFilePath, filePath) => {
                Converter.checkOutputFile(outputFilePath, filePath, res)
            },
            (err) => {
                console.error(`Error during conversion: ${err}`)
                res.status(500).send('Conversion error')
            }
        );
    }

    startServer(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        });
    }
}

export default Server