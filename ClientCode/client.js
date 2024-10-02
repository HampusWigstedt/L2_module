import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

class Client {
    constructor(serverHost = 'localhost', serverPort = 3000) {
        this.serverHost = serverHost
        this.serverPort = serverPort
    }

    async convertFile(filePath) {
        const form = new FormData()
        form.append('file', fs.createReadStream(filePath))

        try {
            const response = await axios.post(`https://cscloud6-195.lnu.se/hmus/convert`, form, {
                headers: form.getHeaders(),
                responseType: 'stream'
            })

            // Save the response to a file
            const outputFilePath = 'output.mp3'
            const writer = fs.createWriteStream(outputFilePath)
            response.data.pipe(writer)

            writer.on('finish', () => {
                console.log(`File successfully downloaded and saved as ${outputFilePath}`)
            })

            writer.on('error', (err) => {
                console.error('Error writing file:', err)
            })
        } catch (err) {
            console.error('Error making API request:', err)
        }
    }

    async getMetadata(filePath) {
        const form = new FormData()
        form.append('file', fs.createReadStream(filePath))

        try {
            const response = await axios.post(`https://cscloud6-195.lnu.se/hmus/metadata`, form, {
                headers: form.getHeaders()
            })

            console.log('Metadata:', response.data)
        } catch (err) {
            console.error('Error retrieving metadata:', err)
        }
    }

    async StereoToSurround(filePath) {
        const form = new FormData()
        form.append('file', fs.createReadStream(filePath))

        try {
            const response = await axios.post(`https://cscloud6-195.lnu.se/hmus/StereoToSurround`, form, {
                headers: form.getHeaders(),
                responseType: 'stream'
            })

            // Save the response to a file
            const outputFilePath = 'output_surround.mp3'
            const writer = fs.createWriteStream(outputFilePath)
            response.data.pipe(writer)

            writer.on('finish', () => {
                console.log(`File successfully downloaded and saved as ${outputFilePath}`)
            })

            writer.on('error', (err) => {
                console.error('Error writing file:', err)
            })
        } catch (err) {
            console.error('Error making API request:', err)
        }
    }

    async resizeVideo(filePath, width, height) {
        const form = new FormData()
        form.append('file', fs.createReadStream(filePath))
        form.append('width', width)
        form.append('height', height)

        try {
            const response = await axios.post(`https://cscloud6-195.lnu.se/hmus/resize`, form, {
                headers: form.getHeaders(),
                responseType: 'stream' // Ensure responseType is set to stream
            })

            // Save the response to a file
            const outputFilePath = `resized_${filePath}`
            const writer = fs.createWriteStream(outputFilePath)
            response.data.pipe(writer)

            writer.on('finish', () => {
                console.log(`File successfully downloaded and saved as ${outputFilePath}`)
            })

            writer.on('error', (err) => {
                console.error('Error writing file:', err)
            })
        } catch (err) {
            console.error('Error making API request:', err)
        }
    }

    async removeAudio(filePath) {
        const form = new FormData()
        form.append('file', fs.createReadStream(filePath))

        try {
            const response = await axios.post(`https://cscloud6-195.lnu.se/hmus/removeaudio`, form, {
                headers: form.getHeaders(),
                responseType: 'stream'
            })

            // Save the response to a file
            const outputFilePath = `no_audio_${filePath}`
            const writer = fs.createWriteStream(outputFilePath)
            response.data.pipe(writer)

            writer.on('finish', () => {
                console.log(`File successfully downloaded and saved as ${outputFilePath}`)
            })

            writer.on('error', (err) => {
                console.error('Error writing file:', err)
            })
        } catch (err) {
            console.error('Error making API request:', err)
        }
    }
}

export default Client