import path from 'path'
import VideoResizer from './resizeVideo.js'
import AudioRemover from './removeAudio.js'
import FileDeleter from './deleteTempFiles.js'
import fs from 'fs'

/**
 * Class responsible for handling file operations.
 */
class FileHandler {
  /**
   * Initializes a new instance of the FileHandler class.
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
   * Handles the file conversion request.
   *
   * @param {object} req - The request object containing file information.
   * @param {object} res - The response object to send the result.
   */
  handleFileConversion (req, res) {
    const filePath = req.file.path
    const outputFilePath = this.getOutputFilePath(req.file.filename, 'mp3')

    console.log(`Starting conversion of ${filePath} to ${outputFilePath}`)

    this.converter.convertToMP3(
      filePath,
      outputFilePath,
      this.logProgress,
      (outputFilePath, filePath) => this.checkOutputFile(outputFilePath, filePath, res),
      (err) => this.handleConversionError(res, err)
    )
  }

  /**
   * Handles the file metadata request.
   *
   * @param {object} req - The request object containing file information.
   * @param {object} res - The response object to send the metadata.
   */
  handleFileMetadata (req, res) {
    const filePath = req.file.path

    console.log(`Getting metadata for ${filePath}`)

    this.metaData.getMetaData(filePath, (metadata) => {
      if (metadata) {
        this.sendMetadata(res, metadata)
      } else {
        this.handleMetadataError(res)
      }
    })
  }

  /**
   * Converts stereo audio to surround sound.
   *
   * @param {object} req - The request object containing file information.
   * @param {object} res - The response object to send the result.
   */
  handleStereoToSurround (req, res) {
    const filePath = req.file.path
    const outputFilePath = this.getOutputFilePath(req.file.filename, 'm4a', '_surround')

    console.log(`Changing audio channels to surround sound for ${filePath}`)

    this.metaData.stereoToSurround(
      filePath,
      outputFilePath,
      this.logProgress,
      (outputFilePath, filePath) => this.sendFileToClient(outputFilePath, filePath, res),
      (error) => this.handleSurroundConversionError(res, error)
    )
  }

  /**
   * Resizes a video to the specified dimensions.
   *
   * @param {object} req - The request object containing file information and desired dimensions.
   * @param {object} res - The response object to send the result.
   */
  handleResizeVideo (req, res) {
    const { width, height } = req.body
    const filePath = req.file.path
    const outputFilePath = this.getOutputFilePath(req.file.originalname, '', 'resized_')

    console.log(`Resizing video ${filePath} to ${width}x${height}`)

    const videoResizer = new VideoResizer(filePath, outputFilePath, width, height)
    videoResizer.resize(
      (outputFilePath) => this.sendFileToClient(outputFilePath, filePath, res),
      (err) => this.handleResizeError(res, err)
    )
  }

  /**
   * Handles the request to remove audio from a video file.
   *
   * @param {object} req - The request object containing file information.
   * @param {object} res - The response object to send the result.
   */
  handleRemoveAudio (req, res) {
    const filePath = req.file.path
    const outputFilePath = this.getOutputFilePath(req.file.originalname, '', 'noaudio_')

    console.log(`Removing audio from video ${filePath}`)

    const audioRemover = new AudioRemover(filePath, outputFilePath)
    audioRemover.removeAudio(
      (outputFilePath) => this.sendFileToClient(outputFilePath, filePath, res, 'video/mp4'),
      (err) => this.handleRemoveAudioError(res, err)
    )
  }

  /**
   * Generates the output file path with the given parameters.
   *
   * @param {string} filename - The original filename.
   * @param {string} [extension] - The file extension for the output file.
   * @param {string} [prefix=''] - The prefix to add to the output filename.
   * @returns {string} - The generated output file path.
   */
  getOutputFilePath (filename, extension, prefix = '') {
    return path.join('uploads', `${prefix}${filename}${extension ? `.${extension}` : ''}`)
  }

  /**
   * Logs the progress of the conversion process.
   *
   * @param {object} progress - The progress object containing the percentage of completion.
   */
  logProgress (progress) {
    console.log(`Processing: ${progress.percent}% done`)
  }

  /**
   * Handles errors that occur during the conversion process.
   *
   * @param {object} res - The response object to send the error message to the client.
   * @param {Error} err - The error object containing details of the error.
   */
  handleConversionError (res, err) {
    console.error(`Error during conversion: ${err}`)
    res.status(500).send('Conversion error')
  }

  /**
   * Handles errors that occur while retrieving metadata.
   *
   * @param {object} res - The response object to send the error message to the client.
   */
  handleMetadataError (res) {
    console.error('Failed to retrieve metadata.')
    res.status(500).send('Failed to retrieve metadata.')
  }

  /**
   * Handles errors that occur during the surround sound conversion process.
   *
   * @param {object} res - The response object to send the error message to the client.
   * @param {Error} error - The error object containing details of the error.
   */
  handleSurroundConversionError (res, error) {
    console.error(`Error during surround sound conversion: ${error}`)
    res.status(500).send('Surround sound conversion error')
  }

  /**
   * Handles errors that occur during the video resizing process.
   *
   * @param {object} res - The response object to send the error message to the client.
   * @param {Error} err - The error object containing details of the error.
   */
  handleResizeError (res, err) {
    console.error('Error resizing video:', err)
    res.status(400).send(err.message)
  }

  /**
   * Handles errors that occur during the audio removal process.
   *
   * @param {object} res - The response object to send the error message to the client.
   * @param {Error} err - The error object containing details of the error.
   */
  handleRemoveAudioError (res, err) {
    console.error('Error removing audio:', err)
    res.status(400).send(err.message)
  }

  /**
   * Checks the output file and handles errors or sends the file to the client.
   *
   * @param {string} outputFilePath - The path to the output file.
   * @param {string} filePath - The path to the original input file.
   * @param {object} res - The response object to send the file or error messages.
   */
  checkOutputFile (outputFilePath, filePath, res) {
    this.converter.checkOutputFile(outputFilePath, filePath, res)
  }

  /**
   * Sends the retrieved metadata to the client and deletes all temporary files.
   *
   * @param {object} res - The response object to send the metadata.
   * @param {object} metadata - The metadata object containing details of the file.
   */
  sendMetadata (res, metadata) {
    console.log('Metadata retrieved successfully:', metadata)
    res.json(metadata)
    this.fileDeleter.deleteAllFiles()
  }

  /**
   * Sends the specified file to the client as a downloadable attachment.
   *
   * @param {string} outputFilePath - The path to the output file to be sent to the client.
   * @param {string} filePath - The path to the original input file.
   * @param {object} res - The response object to send the file to the client.
   * @param {string} [contentType='application/octet-stream'] - The MIME type of the file.
   */
  sendFileToClient (outputFilePath, filePath, res, contentType = 'application/octet-stream') {
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(outputFilePath)}"`)
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', fs.statSync(outputFilePath).size)

    const readStream = fs.createReadStream(outputFilePath)
    readStream.pipe(res)
    readStream.on('error', (err) => this.handleError(res, 'Error reading file', err))
  }

  /**
   * Handles errors by logging the error message and sending a response to the client.
   *
   * @param {object} res - The response object to send the error message to the client.
   * @param {string} message - The error message to log and send to the client.
   * @param {Error} [err=null] - The error object containing details of the error (optional).
   */
  handleError (res, message, err = null) {
    console.error(message, err ? `: ${err}` : '')
    res.status(500).send(message)
  }
}

export default FileHandler
