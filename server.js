// Necessary modules
import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

// Initialize Express application
const app = express();

// Configure Multer to store uploaded files in the 'uploads' directory
const upload = multer({ dest: 'uploads/' });

// Define a route for the root URL
app.get('/', (req, res) => {
    // Send a welcome message when accessing the root URL
    res.send('Welcome to the MP4 to MP3 conversion API. Use POST /convert to upload a file.');
});

// Define a POST route for file conversion
app.post('/convert', upload.single('file'), (req, res) => {
    // Get the path of the uploaded file
    const filePath = req.file.path;
    // Define the output file path for the converted MP3 file
    const outputFilePath = path.join('uploads', `${req.file.filename}.mp3`);

    // Log the start of the conversion process
    console.log(`Starting conversion of ${filePath} to ${outputFilePath}`);

    // Use fluent-ffmpeg to convert the file to MP3 format
    ffmpeg(filePath)
        .toFormat('mp3')
        .on('start', (commandLine) => {
            console.log(`Spawned FFmpeg with command: ${commandLine}`);
        })
        .on('progress', (progress) => {
            console.log(`Processing: ${progress.percent}% done`);
        })
        .on('end', () => {
            // Log the completion of the conversion process
            console.log(`Conversion complete: ${outputFilePath}`);
            // Check if the output file exists and has content
            fs.stat(outputFilePath, (err, stats) => {
                if (err) {
                    console.error(`Error checking output file: ${err}`);
                    return res.status(500).send('Error checking output file');
                }
                if (stats.size === 0) {
                    console.error('Output file is empty');
                    return res.status(500).send('Conversion resulted in an empty file');
                }
                // Send the converted file to the client for download
                res.download(outputFilePath, (err) => {
                    if (err) {
                        // Log any errors that occur during file download
                        console.error(`Error during file download: ${err}`);
                    }
                    // Delete the original uploaded file
                    fs.unlinkSync(filePath);
                    // Delete the converted file after download
                    fs.unlinkSync(outputFilePath);
                });
            });
        })
        .on('error', (err) => {
            // Log any errors that occur during the conversion process
            console.error(`Error during conversion: ${err}`);
            // Send a 500 status code and error message if conversion fails
            res.status(500).send('Conversion error');
        })
        // Save the converted file to the output file path
        .save(outputFilePath);
});

// Start the server on port 3000
app.listen(3000, () => {
    // Log a message indicating that the server is running
    console.log('Server is running on port 3000');
});