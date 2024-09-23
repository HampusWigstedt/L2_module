import MP4ToMP3Converter from './server.js';

// Create an instance of the converter and start the server
const converter = new MP4ToMP3Converter();
converter.startServer(3000);