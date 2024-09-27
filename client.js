import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Function to convert the specified file
async function convertFile(filePath, serverHost, serverPort) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
        const response = await axios.post(`http://${serverHost}:${serverPort}/convert`, form, {
            headers: form.getHeaders(),
            responseType: 'stream'
        });

        // Save the response to a file
        const outputFilePath = 'output.mp3';
        const writer = fs.createWriteStream(outputFilePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log(`File successfully downloaded and saved as ${outputFilePath}`);
        });

        writer.on('error', (err) => {
            console.error('Error writing file:', err);
        });
    } catch (err) {
        console.error('Error making API request:', err);
    }
}

// Function to get metadata of the specified file
async function getMetadata(filePath, serverHost, serverPort) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
        console.log(`Sending request to http://${serverHost}:${serverPort}/metadata`);
        const response = await axios.post(`http://${serverHost}:${serverPort}/metadata`, form, {
            headers: form.getHeaders()
        });

        console.log('Metadata:', response.data);
    } catch (err) {
        console.error('Error retrieving metadata:', err);
    }
}

// Function to change the audio channels to surround sound
async function changeAudioChannel(filePath, serverHost, serverPort) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
        const response = await axios.post(`http://${serverHost}:${serverPort}/changeAudioChannel`, form, {
            headers: form.getHeaders(),
            responseType: 'stream'
        });

        // Save the response to a file
        const outputFilePath = 'output_surround.mp3';
        const writer = fs.createWriteStream(outputFilePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log(`File successfully downloaded and saved as ${outputFilePath}`);
        });

        writer.on('error', (err) => {
            console.error('Error writing file:', err);
        });
    } catch (err) {
        console.error('Error making API request:', err);
    }
}

// Get the action, file path, server host, and server port from command line arguments
const action = process.argv[2];
const filePath = process.argv[3];
const serverHost = process.argv[4] || 'localhost';
const serverPort = process.argv[5] || 3000;

if (!action || !filePath) {
    console.error('Usage: node client.js <action> <file-path> <server-host> <server-port>');
    console.error('Actions: convert, metadata, changeAudioChannel');
    process.exit(1);
}

// Perform the specified action
if (action === 'convert') {
    convertFile(filePath, serverHost, serverPort);
} else if (action === 'metadata') {
    getMetadata(filePath, serverHost, serverPort);
} else if (action === 'changeAudioChannel') {
    changeAudioChannel(filePath, serverHost, serverPort);
} else {
    console.error('Invalid action. Use "convert", "metadata", or "changeAudioChannel".');
    process.exit(1);
}