import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

/**
 * Client class to interact with the server for file conversion and metadata operations.
 */
class Client {
  /**
   * Initializes a new instance of the Client class.
   *
   * @param {string} [serverHost='cscloud6-195.lnu.se'] - The server host.
   * @param {number} [serverPort=3000] - The server port.
   */
  constructor (serverHost = 'cscloud6-195.lnu.se', serverPort = 3000) {
    this.serverHost = serverHost
    this.serverPort = serverPort
    this.baseUrl = `https://${serverHost}/hmus`
  }

  /**
   * Converts a file to MP3 format.
   *
   * @param {string} filePath - The path to the input file.
   */
  async convertFile (filePath) {
    const form = this.createFormData(filePath)
    const outputFilePath = 'output.mp3'
    await this.sendApiRequest('convert', form, outputFilePath)
  }

  /**
   * Retrieves metadata for a file.
   *
   * @param {string} filePath - The path to the input file.
   */
  async getMetadata (filePath) {
    const form = this.createFormData(filePath)
    try {
      const response = await axios.post(`${this.baseUrl}/metadata`, form, {
        headers: form.getHeaders()
      })
      console.log('Metadata:', response.data)
    } catch (err) {
      this.handleError('Error retrieving metadata', err)
    }
  }

  /**
   * Converts a stereo audio file to surround sound.
   *
   * @param {string} filePath - The path to the input file.
   */
  async stereoToSurround (filePath) {
    const form = this.createFormData(filePath)
    const outputFilePath = 'output_surround.mp3'
    await this.sendApiRequest('StereoToSurround', form, outputFilePath)
  }

  /**
   * Resizes a video to the specified dimensions.
   *
   * @param {string} filePath - The path to the input file.
   * @param {number} width - The desired width of the output video.
   * @param {number} height - The desired height of the output video.
   */
  async resizeVideo (filePath, width, height) {
    const form = this.createFormDataWithDimensions(filePath, width, height)
    const outputFilePath = `resized_${filePath}`
    await this.sendApiRequest('resize', form, outputFilePath)
  }

  /**
   * Removes audio from a video file.
   *
   * @param {string} filePath - The path to the input file.
   */
  async removeAudio (filePath) {
    const form = this.createFormData(filePath)
    const outputFilePath = `no_audio_${filePath}`
    await this.sendApiRequest('removeaudio', form, outputFilePath)
  }

  /**
   * Creates a FormData object with the specified file.
   *
   * @param {string} filePath - The path to the input file.
   * @returns {FormData} - The created FormData object.
   */
  createFormData (filePath) {
    const form = new FormData()
    form.append('file', fs.createReadStream(filePath))
    return form
  }

  /**
   * Creates a FormData object with the specified file and dimensions.
   *
   * @param {string} filePath - The path to the input file.
   * @param {number} width - The desired width of the output video.
   * @param {number} height - The desired height of the output video.
   * @returns {FormData} - The created FormData object with dimensions.
   */
  createFormDataWithDimensions (filePath, width, height) {
    const form = this.createFormData(filePath)
    form.append('width', width)
    form.append('height', height)
    return form
  }

  /**
   * Sends an API request to the server with the specified form data.
   *
   * @param {string} action - The action to perform (e.g., 'convert', 'resize').
   * @param {FormData} form - The form data to send.
   * @param {string} outputFilePath - The path to save the output file.
   */
  async sendApiRequest (action, form, outputFilePath) {
    try {
      const response = await axios.post(`${this.baseUrl}/${action}`, form, {
        headers: form.getHeaders(),
        responseType: 'stream'
      })
      await this.saveResponseToFile(response, outputFilePath)
    } catch (err) {
      this.handleError(`Error making API request for ${action}`, err)
    }
  }

  /**
   * Saves the response data to a file.
   *
   * @param {object} response - The response object containing the data.
   * @param {string} outputFilePath - The path to save the output file.
   * @returns {Promise<void>} - A promise that resolves when the file is saved.
   */
  async saveResponseToFile (response, outputFilePath) {
    const writer = fs.createWriteStream(outputFilePath)
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`File successfully downloaded and saved as ${outputFilePath}`)
        resolve()
      })
      writer.on('error', (err) => {
        this.handleError('Error writing file', err)
        reject(err)
      })
    })
  }

  /**
   * Logs an error message with the associated error object.
   *
   * @param {string} message - The error message to log.
   * @param {Error} err - The error object containing details of the error.
   */
  handleError (message, err) {
    console.error(`${message}:`, err)
  }
}

export default Client
