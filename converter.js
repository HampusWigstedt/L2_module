import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import FileDeleter from './deleteTempFiles.js'

/**
 * Class responsible for converting files.
 */
class Converter {
  /**
   * Initializes a new instance of the Converter class.
   */
  constructor () {
    this.fileDeleter = new FileDeleter()
  }

  /**
   * Converts an audio file to MP3 format.
   *
   * @param {string} filePath - The path to the input audio file.
   * @param {string} outputFilePath - The path to save the output MP3 file.
   * @param {Function} onProgress - Callback function to be called with progress updates.
   * @param {Function} onComplete - Callback function to be called on successful conversion completion.
   * @param {Function} onError - Callback function to be called on error.
   */
  convertToMP3 (filePath, outputFilePath, onProgress, onComplete, onError) {
    const ffmpegProcess = this.createFfmpegProcess(filePath, outputFilePath, onProgress, onComplete, onError)
    this.runFfmpegProcess(ffmpegProcess)
  }

  /**
   * Creates an FFmpeg process to convert an audio file to MP3 format.
   *
   * @param {string} filePath - The path to the input audio file.
   * @param {string} outputFilePath - The path to save the output MP3 file.
   * @param {Function} onProgress - Callback function to be called with progress updates.
   * @param {Function} onComplete - Callback function to be called on successful conversion completion.
   * @param {Function} onError - Callback function to be called on error.
   * @returns {object} - The FFmpeg process instance.
   */
  createFfmpegProcess (filePath, outputFilePath, onProgress, onComplete, onError) {
    return ffmpeg(filePath)
      .toFormat('mp3')
      .on('start', this.logFfmpegStart)
      .on('progress', onProgress)
      .on('end', () => this.handleFfmpegEnd(outputFilePath, filePath, onComplete))
      .on('error', onError)
      .save(outputFilePath)
  }

  /**
   * Runs the given FFmpeg process.
   *
   * @param {object} ffmpegProcess - The FFmpeg process instance to be run.
   */
  runFfmpegProcess (ffmpegProcess) {
    ffmpegProcess.run()
  }

  /**
   * Logs the start of the FFmpeg process with the given command line.
   *
   * @param {string} commandLine - The command line string used to spawn the FFmpeg process.
   */
  logFfmpegStart (commandLine) {
    console.log(`Spawned FFmpeg with command: ${commandLine}`)
  }

  /**
   * Handles the end event of the FFmpeg process.
   *
   * @param {string} outputFilePath - The path to the output file.
   * @param {string} filePath - The path to the original input file.
   * @param {Function} onComplete - Callback function to be called on successful process completion.
   */
  handleFfmpegEnd (outputFilePath, filePath, onComplete) {
    console.log(`Conversion complete: ${outputFilePath}`)
    onComplete(outputFilePath, filePath)
    this.fileDeleter.deleteAllFiles() // Deleting all temporary files
  }

  /**
   * Checks the output file and handles errors or sends the file to the client.
   *
   * @param {string} outputFilePath - The path to the output file.
   * @param {string} filePath - The path to the original input file.
   * @param {object} res - The response object to send the file or error messages.
   */
  checkOutputFile (outputFilePath, filePath, res) {
    fs.stat(outputFilePath, (err, stats) => {
      if (err) {
        this.handleFileError('Error checking output file', err, res)
        return
      }
      if (stats.size === 0) {
        this.handleEmptyFileError(res)
        return
      }
      this.sendFileToClient(outputFilePath, filePath, res)
    })
  }

  /**
   * Handles file-related errors by logging the error and sending a response to the client.
   *
   * @param {string} message - The error message to log and send to the client.
   * @param {Error} err - The error object containing details of the error.
   * @param {object} res - The response object to send the error message to the client.
   */
  handleFileError (message, err, res) {
    console.error(`${message}: ${err}`)
    res.status(500).send(message)
  }

  /**
   * Handles the error when the conversion results in an empty file.
   *
   * @param {object} res - The response object to send the error message to the client.
   */
  handleEmptyFileError (res) {
    const message = 'Conversion resulted in an empty file'
    console.error(message)
    res.status(500).send(message)
  }

  /**
   * Sends the converted file to the client and deletes the original and output files.
   *
   * @param {string} outputFilePath - The path to the output file to be sent to the client.
   * @param {string} filePath - The path to the original input file.
   * @param {object} res - The response object to send the file to the client.
   */
  sendFileToClient (outputFilePath, filePath, res) {
    res.download(outputFilePath, (err) => {
      if (err) {
        console.error(`Error during file download: ${err}`)
      }
      this.deleteFiles([filePath, outputFilePath])
    })
  }

  /**
   * Deletes the specified files.
   *
   * @param {string[]} files - An array of file paths to be deleted.
   */
  deleteFiles (files) {
    files.forEach(file => {
      try {
        fs.unlinkSync(file)
        console.log(`File deleted: ${file}`)
      } catch (err) {
        console.error(`Error deleting file: ${file}`, err)
      }
    })
  }
}

export default Converter
