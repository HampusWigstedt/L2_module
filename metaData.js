import ffmpeg from 'fluent-ffmpeg'
import FileDeleter from './deleteTempFiles.js'

/**
 * Class responsible for handling metadata operations.
 */
class MetaData {
  /**
   * Initializes a new instance of the MetaData class.
   */
  constructor () {
    this.fileDeleter = new FileDeleter()
  }

  /**
   * Retrieves metadata for the given video file.
   *
   * @param {string} filePath - The path to the video file.
   * @param {Function} onMetaData - Callback function to be called with the metadata or null if an error occurs.
   */
  getMetaData (filePath, onMetaData) {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        this.logError('Error getting metadata', err)
        return onMetaData(null)
      }
      onMetaData(metadata)
    })
  }

  /**
   * Converts a stereo audio file to surround sound.
   *
   * @param {string} filePath - The path to the input audio file.
   * @param {string} outputFilePath - The path to save the output surround sound file.
   * @param {Function} onProgress - Callback function to be called with progress updates.
   * @param {Function} onComplete - Callback function to be called on successful conversion completion.
   * @param {Function} onError - Callback function to be called on error.
   */
  stereoToSurround (filePath, outputFilePath, onProgress, onComplete, onError) {
    const ffmpegProcess = this.createFfmpegProcess(filePath, outputFilePath, onProgress, onComplete, onError)
    this.runFfmpegProcess(ffmpegProcess)
  }

  /**
   * Creates an FFmpeg process to convert a stereo audio file to surround sound.
   *
   * @param {string} filePath - The path to the input audio file.
   * @param {string} outputFilePath - The path to save the output surround sound file.
   * @param {Function} onProgress - Callback function to be called with progress updates.
   * @param {Function} onComplete - Callback function to be called on successful conversion completion.
   * @param {Function} onError - Callback function to be called on error.
   * @returns {object} - The FFmpeg process instance.
   */
  createFfmpegProcess (filePath, outputFilePath, onProgress, onComplete, onError) {
    return ffmpeg(filePath)
      .audioCodec('aac')
      .audioChannels(6)
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
    this.fileDeleter.deleteAllFiles()
  }

  /**
   * Logs an error message with the associated error object.
   *
   * @param {string} message - The error message to log.
   * @param {Error} err - The error object containing details of the error.
   */
  logError (message, err) {
    console.error(`${message}: ${err.message}`)
  }
}

export default MetaData
