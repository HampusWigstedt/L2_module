import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import FileDeleter from './deleteTempFiles.js'

/**
 *
 */
class Converter {
  /**
   *
   */
  constructor () {
    this.fileDeleter = new FileDeleter()
  }

  /**
   *
   * @param filePath
   * @param outputFilePath
   * @param onProgress
   * @param onComplete
   * @param onError
   */
  convertToMP3 (filePath, outputFilePath, onProgress, onComplete, onError) {
    ffmpeg(filePath)
      .toFormat('mp3')
      .on('start', (commandLine) => {
        console.log(`Spawned FFmpeg with command: ${commandLine}`)
      })
      .on('progress', onProgress)
      .on('end', () => {
        console.log(`Conversion complete: ${outputFilePath}`)
        onComplete(outputFilePath, filePath)
        this.fileDeleter.deleteAllFiles() // Deleting all temporary files
      })
      .on('error', onError)
      .save(outputFilePath)
  }

  /**
   *
   * @param outputFilePath
   * @param filePath
   * @param res
   */
  checkOutputFile (outputFilePath, filePath, res) {
    fs.stat(outputFilePath, (err, stats) => {
      if (err) {
        console.error(`Error checking output file: ${err}`)
        return res.status(500).send('Error checking output file')
      }
      if (stats.size === 0) {
        console.error('Output file is empty')
        return res.status(500).send('Conversion resulted in an empty file')
      }
      this.sendFileToClient(outputFilePath, filePath, res)
    })
  }

  /**
   *
   * @param outputFilePath
   * @param filePath
   * @param res
   */
  sendFileToClient (outputFilePath, filePath, res) {
    res.download(outputFilePath, (err) => {
      if (err) {
        console.error(`Error during file download: ${err}`)
      }
      fs.unlinkSync(filePath)
      fs.unlinkSync(outputFilePath)
    })
  }
}

export default Converter
