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

}

export default FileHandler;