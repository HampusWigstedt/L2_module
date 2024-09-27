import express from 'express';
import multer from 'multer';
import Converter from './converter.js';
import MetaData from './metaData.js';
import FileHandler from './handlers.js';

class Server {
    constructor() {
        this.app = express();
        this.upload = multer({ dest: 'uploads/' });
        this.converter = new Converter(); // Create an instance of the Converter class
        this.metaData = new MetaData(); // Create an instance of the MetaData class
        this.fileHandler = new FileHandler(this.converter, this.metaData); // Create an instance of the FileHandler class
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.get('/', this.handleRootRequest.bind(this));
        this.app.post('/convert', this.upload.single('file'), this.fileHandler.handleFileConversion.bind(this.fileHandler));
        this.app.post('/metadata', this.upload.single('file'), this.fileHandler.handleFileMetadata.bind(this.fileHandler));
        this.app.post('/changeAudioChannel', this.upload.single('file'), this.fileHandler.handleChangeAudioChannel.bind(this.fileHandler));
    }

    handleRootRequest(req, res) {
        res.send('Welcome to the MP4 to MP3 conversion API. Use POST /convert to upload a file.');
    }

    startServer(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default Server;