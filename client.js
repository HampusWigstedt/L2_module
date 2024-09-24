import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

// Function to convert the specified file
async function convertFile(filePath, serverHost, serverPort) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath))

    try {
        const response = await axios.post(`http://${serverHost}:${serverPort}/convert`, form, {
            headers: form.getHeaders(),
            responseType: 'stream'
        });

        // Save the response to a file
        const outputFilePath = 'output.mp3'
        const writer = fs.createWriteStream(outputFilePath)
        response.data.pipe(writer)

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

// Get the file path from command line arguments
const filePath = process.argv[2];
const serverHost = process.argv[3] || 'localhost'
const serverPort = process.argv[4] || 3000

if (!filePath) {
    console.error('Please provide a file path to convert.')
    process.exit(1)
}

// Convert the specified file
convertFile(filePath, serverHost, serverPort)