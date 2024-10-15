import { readdir, unlink } from 'fs/promises'
import { join } from 'path'

/**
 * Class responsible for deleting temporary files in a specified directory.
 */
class FileDeleter {
  /**
   * Initializes a new instance of the FileDeleter class.
   *
   * @param {string} [directory='uploads'] - The directory where temporary files are stored.
   */
  constructor (directory = 'uploads') {
    this.directory = directory
  }

  /**
   * Deletes all files in the specified directory.
   */
  async deleteAllFiles () {
    try {
      const files = await this.getFilesInDirectory()
      await this.deleteFiles(files)
    } catch (error) {
      this.logError('Could not read directory', error)
    }
  }

  /**
   * Retrieves a list of files in the specified directory.
   *
   * @returns {Promise<string[]>} - A promise that resolves to an array of file names.
   */
  async getFilesInDirectory () {
    const files = await readdir(this.directory)
    console.log('Files found:', files)
    return files
  }

  /**
   * Deletes the specified files in the directory.
   *
   * @param {string[]} files - An array of file names to be deleted.
   */
  async deleteFiles (files) {
    for (const file of files) {
      const filePath = join(this.directory, file)
      await this.deleteFile(filePath)
    }
  }

  /**
   * Deletes a single file at the specified file path.
   *
   * @param {string} filePath - The path to the file to be deleted.
   */
  async deleteFile (filePath) {
    try {
      await unlink(filePath)
      console.log(`File deleted: ${filePath}`)
    } catch (error) {
      this.logError(`Could not delete file: ${filePath}`, error)
    }
  }

  /**
   * Logs an error message with the associated error object.
   *
   * @param {string} message - The error message to log.
   * @param {Error} error - The error object containing details of the error.
   */
  logError (message, error) {
    console.error(`${message}:`, error)
  }
}

export default FileDeleter
