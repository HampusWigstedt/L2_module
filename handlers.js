import path from 'path'
import { exec } from 'child_process'

class FileHandler {
    constructor(converter, metaData) {
        this.converter = converter
        this.metaData = metaData
    }

    handleFileConversion(req, res) {
        const filePath = req.file.path
        const outputFilePath = path.join('uploads', `${req.file.filename}.mp3`)

        console.log(`Starting conversion of ${filePath} to ${outputFilePath}`)

        this.converter.convertToMP3(
            filePath,
            outputFilePath,
            (progress) => {
                console.log(`Processing: ${progress.percent}% done`)
            },
            (outputFilePath, filePath) => {
                this.converter.checkOutputFile(outputFilePath, filePath, res)
            },
            (err) => {
                console.error(`Error during conversion: ${err}`)
                res.status(500).send('Conversion error')
            }
        );
    }

    handleFileMetadata(req, res) {
        const filePath = req.file.path

        console.log(`Getting metadata for ${filePath}`)

        this.metaData.getMetaData(filePath, (metadata) => {
            if (metadata) {
                console.log('Metadata retrieved successfully:', metadata)
                res.json(metadata)
            } else {
                console.error('Failed to retrieve metadata.')
                res.status(500).send('Failed to retrieve metadata.')
            }
        });
    }

    handleChangeAudioChannel(req, res) {
        const filePath = req.file.path;
        const outputFilePath = path.join('uploads', `${req.file.filename}_surround.m4a`)

        console.log(`Changing audio channels to surround sound for ${filePath}`)

        this.metaData.changeAudioChannel(
            filePath,
            outputFilePath,
            (progress) => {
                console.log(`Processing: ${progress.percent}% done`)
            },
            (outputFilePath, filePath) => {
                console.log(`Conversion complete: ${outputFilePath}`)
                res.download(outputFilePath, (err) => {
                    if (err) {
                        console.error(`Error sending file: ${err}`)
                        res.status(500).send('Error sending file')
                    }
                })
            },
            (error) => {
                console.error(`Error during surround sound conversion: ${error}`)
                res.status(500).send('Surround sound conversion error')
            }
        )
    }

    handleResizeVideo(req, res) {
        const { width, height } = req.body
        const filePath = req.file.path
        const outputFilePath = path.join('uploads', `resized_${req.file.originalname}`)

        console.log(`Resizing video ${filePath} to ${width}x${height}`)

        if (!width || !height) {
            console.error('Width and height must be specified.')
            return res.status(400).send('Width and height must be specified.')
        }

        if (isNaN(width) || isNaN(height)) {
            console.error('Width and height must be numbers.')
            return res.status(400).send('Width and height must be numbers.')
        }

        if (width <= 0 || height <= 0) {
            console.error('Width and height must be positive numbers.')
            return res.status(400).send('Width and height must be positive numbers.')
        }

        exec(`ffmpeg -i ${filePath} -vf scale=${width}:${height} ${outputFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error resizing video: ${error.message}`)
                return res.status(500).send('Error resizing video')
            }
            
            console.log(`Video successfully resized and saved as ${outputFilePath}`)
            res.send(`Video successfully resized and saved as ${outputFilePath}`)
        })
    }

    handleRemoveAudio(req, res) {
        const filePath = req.file.path
        const outputFilePath = path.join('uploads', `no_audio_${req.file.originalname}`)

        console.log(`Removing audio from ${filePath}`)

        exec(`ffmpeg -i ${filePath} -an ${outputFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error removing audio: ${error.message}`)
                return res.status(500).send('Error removing audio')
            }

            console.log(`Audio successfully removed and saved as ${outputFilePath}`)
            res.send(`Audio successfully removed and saved as ${outputFilePath}`)
        })
    }

}

export default FileHandler;