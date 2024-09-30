import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

class Client {
    constructor(serverHost = 'localhost', serverPort = 3000) {
        this.serverHost = serverHost
        this.serverPort = serverPort
        this.filePath = null
    }

    setFilePath(filePath) {
        this.filePath = filePath;
    }

    async convertFile() {
        if (!this.filePath) {
            console.error('File path is not set.')
            return
        }

        const form = new FormData()
        form.append('file', fs.createReadStream(this.filePath))

        try {
            const response = await axios.post(`http://${this.serverHost}:${this.serverPort}/convert`, form, {
                headers: form.getHeaders(),
                responseType: 'stream'
            })

            // Save the response to a file
            const outputFilePath = 'output.mp3'
            const writer = fs.createWriteStream(outputFilePath)
            response.data.pipe(writer);

            writer.on('finish', () => {
                console.log(`File successfully downloaded and saved as ${outputFilePath}`)
            });

            writer.on('error', (err) => {
                console.error('Error writing file:', err)
            });
        } catch (err) {
            console.error('Error making API request:', err)
        }
    }

    async getMetadata() {
        if (!this.filePath) {
            console.error('File path is not set.')
            return;
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(this.filePath))

        try {
            console.log(`Sending request to http://${this.serverHost}:${this.serverPort}/metadata`)
            const response = await axios.post(`http://${this.serverHost}:${this.serverPort}/metadata`, form, {
                headers: form.getHeaders()
            });

            console.log('Metadata:', response.data)
        } catch (err) {
            console.error('Error retrieving metadata:', err)
        }
    }

    async changeAudioChannel() {
        if (!this.filePath) {
            console.error('File path is not set.')
            return;
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(this.filePath))

        try {
            const response = await axios.post(`http://${this.serverHost}:${this.serverPort}/changeAudioChannel`, form, {
                headers: form.getHeaders(),
                responseType: 'stream'
            })

            // Save the response to a file
            const outputFilePath = 'output_surround.mp3'
            const writer = fs.createWriteStream(outputFilePath)
            response.data.pipe(writer);

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

    async resizeVideo(width, height) {
        if (!this.filePath) {
            console.error('File path is not set.')
            return
        }

        const form = new FormData()
        form.append('file', fs.createReadStream(this.filePath))
        form.append('width', width)
        form.append('height', height)

        try {
            const response = await axios.post(`http://${this.serverHost}:${this.serverPort}/resize`, form, {
                headers: form.getHeaders(),
                responseType: 'stream' // Ensure responseType is set to stream
            })

            // Save the response to a file
            const outputFilePath = `resized_${this.filePath}`
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

    async removeAudio() {
        if (!this.filePath) {
            console.error('File path is not set.')
            return
        }

        const form = new FormData()
        form.append('file', fs.createReadStream(this.filePath))

        try {
            const response = await axios.post(`http://${this.serverHost}:${this.serverPort}/removeaudio`, form, {
                headers: form.getHeaders(),
                responseType: 'stream'
            })

            // Save the response to a file
            const outputFilePath = `no_audio_${this.filePath}`
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