// Necessary modules
import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

class MP4ToMP3Converter {
    constructor() {
        this.app = express();
        this.upload = multer({ dest: 'uploads/' });
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.get('/', this.handleRootRequest.bind(this));
        this.app.post('/convert', this.upload.single('file'), this.handleFileConversion.bind(this));
    }

    handleRootRequest(req, res) {
        res.send('Welcome to the MP4 to MP3 conversion API. Use POST /convert to upload a file.');
    }

    handleFileConversion(req, res) {
        const filePath = req.file.path;
        const outputFilePath = path.join('uploads', `${req.file.filename}.mp3`);

        console.log(`Starting conversion of ${filePath} to ${outputFilePath}`);

        ffmpeg(filePath)
            .toFormat('mp3')
            .on('start', (commandLine) => {
                console.log(`Spawned FFmpeg with command: ${commandLine}`);
            })
            .on('progress', (progress) => {
                console.log(`Processing: ${progress.percent}% done`);
            })
            .on('end', () => {
                console.log(`Conversion complete: ${outputFilePath}`);
                this.checkOutputFile(outputFilePath, filePath, res);
            })
            .on('error', (err) => {
                console.error(`Error during conversion: ${err}`);
                res.status(500).send('Conversion error');
            })
            .save(outputFilePath);
    }

    checkOutputFile(outputFilePath, filePath, res) {
        fs.stat(outputFilePath, (err, stats) => {
            if (err) {
                console.error(`Error checking output file: ${err}`);
                return res.status(500).send('Error checking output file');
            }
            if (stats.size === 0) {
                console.error('Output file is empty');
                return res.status(500).send('Conversion resulted in an empty file');
            }
            this.sendFileToClient(outputFilePath, filePath, res);
        });
    }

    sendFileToClient(outputFilePath, filePath, res) {
        res.download(outputFilePath, (err) => {
            if (err) {
                console.error(`Error during file download: ${err}`);
            }
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputFilePath);
        });
    }

    startServer(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default MP4ToMP3Converter;