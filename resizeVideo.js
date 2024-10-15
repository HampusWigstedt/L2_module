import ffmpeg from 'fluent-ffmpeg'
import FileDeleter from './deleteTempFiles.js'

/**
 * A class that resizes a video file.
 */
class VideoResizer {
/**
 * Resizes a video to the specified dimensions.
 *
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFilePath - The path to save the resized video file.
 * @param {number} width - The desired width of the resized video.
 * @param {number} height - The desired height of the resized video.
 */
  constructor (inputFilePath, outputFilePath, width, height) {
    this.inputFilePath = inputFilePath
    this.outputFilePath = outputFilePath
    this.width = width
    this.height = height
    this.fileDeleter = new FileDeleter()
  }

  /**
   * Resizes the video to the specified dimensions.
   *
   * @param {Function} onSuccess - Callback function to be called on successful resize.
   * @param {Function} onError - Callback function to be called on error.
   */
  resize (onSuccess, onError) {
    const validationError = this.validateDimensions(this.width, this.height)
    if (validationError) {
      onError(new Error(validationError))
      return
    }

    const ffmpegProcess = this.createFfmpegProcess(onSuccess, onError)
    this.runFfmpegProcess(ffmpegProcess)
  }

  /**
   * Creates an FFmpeg process to resize the video.
   *
   * @param {Function} onSuccess - Callback function to be called on successful process completion.
   * @param {Function} onError - Callback function to be called on error.
   * @returns {object} - The FFmpeg process instance.
   */
  createFfmpegProcess (onSuccess, onError) {
    return ffmpeg(this.inputFilePath)
      .size(`${this.width}x${this.height}`)
      .outputOptions('-movflags', 'faststart') // Ensure moov atom is at the beginning of the file for streaming
      .output(this.outputFilePath)
      .on('end', () => this.handleFfmpegEnd(onSuccess))
      .on('error', (err) => this.handleFfmpegError(err, onError))
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
   * Handles the end event of the FFmpeg process.
   *
   * @param {Function} onSuccess - Callback function to be called on successful process completion.
   */
  handleFfmpegEnd (onSuccess) {
    console.log(`Video successfully resized and saved as ${this.outputFilePath}`)
    onSuccess(this.outputFilePath)
    this.fileDeleter.deleteAllFiles() // Delete all temporary files
  }

  /**
   * Handles the error event of the FFmpeg process.
   *
   * @param {Error} err - The error object.
   * @param {Function} onError - Callback function to be called on error.
   */
  handleFfmpegError (err, onError) {
    console.error('Error resizing video:', err.message)
    onError(err)
  }

  /**
   * Validates the given width and height dimensions.
   *
   * @param {number} width - The width to be validated.
   * @param {number} height - The height to be validated.
   * @returns {string|null} - Returns an error message if validation fails, otherwise null.
   */
  validateDimensions (width, height) {
    if (!width || !height) {
      return 'Width and height must be specified.'
    }

    if (isNaN(width) || isNaN(height)) {
      return 'Width and height must be numbers.'
    }

    if (width <= 0 || height <= 0) {
      return 'Width and height must be positive numbers.'
    }

    return null
  }
}

export default VideoResizer
