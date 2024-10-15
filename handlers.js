import path from 'path'
import VideoResizer from './resizeVideo.js'
import AudioRemover from './removeAudio.js'
import FileDeleter from './deleteTempFiles.js'
import fs from 'fs'

/**
 *
 */
class FileHandler {
  /**
   * Initializes a new instance of the class.
   *
   * @param {Function} converter - A function that converts data.
   * @param {object} metaData - An object containing metadata information.
   */
  constructor (converter, metaData) {
    this.converter = converter
    this.metaData = metaData
    this.fileDeleter = new FileDeleter()
  }

  /**
   *
   * @param req
   * @param res
   */
  handleFileConversion (req, res) {
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
    )
  }

  /**
   *
   * @param req
   * @param res
   */
  handleFileMetadata (req, res) {
    const filePath = req.file.path

    console.log(`Getting metadata for ${filePath}`)

    this.metaData.getMetaData(filePath, (metadata) => {
      if (metadata) {
        console.log('Metadata retrieved successfully:', metadata)
        res.json(metadata)
        this.fileDeleter.deleteAllFiles()
      } else {
        console.error('Failed to retrieve metadata.')
        res.status(500).send('Failed to retrieve metadata.')
      }
    })
  }

  /**
   *
   * @param req
   * @param res
   */
  handleStereoToSurround (req, res) {
    const filePath = req.file.path
    const outputFilePath = path.join('uploads', `${req.file.filename}_surround.m4a`)

    console.log(`Changing audio channels to surround sound for ${filePath}`)

    this.metaData.StereoToSurround(
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

  /**
   *
   * @param req
   * @param res
   */
  handleResizeVideo (req, res) {
    const { width, height } = req.body
    const filePath = req.file.path
    const outputFilePath = path.join('uploads', `resized_${req.file.originalname}`)

    console.log(`Resizing video ${filePath} to ${width}x${height}`)

    const videoResizer = new VideoResizer(filePath, outputFilePath, width, height)
    videoResizer.resize(
      (outputFilePath) => {
        res.download(outputFilePath, (err) => {
          if (err) {
            console.error('Error sending file:', err)
            res.status(500).send('Error sending file')
          }
        })
      },
      (err) => {
        res.status(400).send(err.message)
      }
    )
  }

  /**
   *
   * @param req
   * @param res
   */
  handleRemoveAudio (req, res) {
    const filePath = req.file.path
    const outputFilePath = path.join('uploads', `noaudio_${req.file.originalname}`)

    console.log(`Removing audio from video ${filePath}`)

    const audioRemover = new AudioRemover(filePath, outputFilePath)
    audioRemover.removeAudio(
      (outputFilePath) => {
        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="noaudio_${path.basename(outputFilePath)}"`)
        res.setHeader('Content-Type', 'video/mp4')
        res.setHeader('Content-Length', fs.statSync(outputFilePath).size)

        const readStream = fs.createReadStream(outputFilePath) // Creating a read stream for the output file
        readStream.pipe(res) // Piping the read stream to the response

        readStream.on('error', (err) => {
          console.error('Error reading file:', err)
          res.status(500).send('Error reading file')
        })
      },
      (err) => {
        res.status(400).send(err.message)
      }
    )
  }
}

export default FileHandler
