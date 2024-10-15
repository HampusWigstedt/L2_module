import { readdir, unlink } from 'fs/promises'
import { join } from 'path'

/**
 *
 */
class FileDeleter {
  /**
   *
   */
  constructor () {
    this.directory = 'uploads'
  }

  // Method to delete all files in the uploads(temp) directory
  /**
   *
   */
  async deleteAllFiles () {
    try {
      // Read all files in the directory
      const files = await readdir(this.directory)
      console.log('Files found:', files)

      // Iterate over each file and delete it
      for (const file of files) {
        const filePath = join(this.directory, file)
        try {
          await unlink(filePath)
          console.log(`File deleted: ${filePath}`)
        } catch (error) {
          console.error(`Could not delete file: ${filePath}`, error)
        }
      }
    } catch (error) {
      console.error('Could not read directory:', error)
    }
  }
}

export default FileDeleter
