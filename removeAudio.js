import ffmpeg from 'fluent-ffmpeg'
import FileDeleter from './deleteTempFiles.js'

/**
 * Class responsible for removing audio from video files.
 */
class AudioRemover {
  /**
   * Initializes a new instance of the AudioRemover class.
   *
   * @param {string} inputFilePath - The path to the input video file.
   * @param {string} outputFilePath - The path to save the output video file without audio.
   */
  constructor (inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath
    this.outputFilePath = outputFilePath
    this.fileDeleter = new FileDeleter()
  }

  /**
   * Removes audio from the video file.
   *
   * @param {Function} onSuccess - Callback function to be called on successful process completion.
   * @param {Function} onError - Callback function to be called on error.
   */
  removeAudio (onSuccess, onError) {
    this.initializeFfmpegProcess(onSuccess, onError).run()
  }

  /**
   * Initializes the FFmpeg process to remove audio from the video file.
   *
   * @param {Function} onSuccess - Callback function to be called on successful process completion.
   * @param {Function} onError - Callback function to be called on error.
   * @returns {object} - The FFmpeg process instance.
   */
  initializeFfmpegProcess (onSuccess, onError) {
    return ffmpeg(this.inputFilePath)
      .noAudio()
      .outputOptions('-movflags', 'faststart') // Ensure moov atom is at the beginning of the file for streaming
      .output(this.outputFilePath)
      .on('start', this.onFfmpegStart)
      .on('end', () => this.onFfmpegEnd(onSuccess))
      .on('error', (err) => this.onFfmpegError(err, onError))
  }

  /**
   * Handles the start event of the FFmpeg process.
   *
   * @param {string} commandLine - The command line string used to spawn the FFmpeg process.
   */
  onFfmpegStart (commandLine) {
    console.log(`Spawned FFmpeg with command: ${commandLine}`)
  }

  /**
   * Handles the end event of the FFmpeg process for removing audio.
   *
   * @param {Function} onSuccess - Callback function to be called on successful process completion.
   */
  onFfmpegEnd (onSuccess) {
    console.log(`Audio successfully removed and saved as ${this.outputFilePath}`)
    onSuccess(this.outputFilePath)
    this.fileDeleter.deleteAllFiles() // Delete all temporary files
  }

  /**
   * Handles the error event of the FFmpeg process.
   *
   * @param {Error} err - The error object.
   * @param {Function} onError - Callback function to be called on error.
   */
  onFfmpegError (err, onError) {
    console.error('Error removing audio:', err.message)
    onError(err)
  }
}

export default AudioRemover
