import path from 'path';
import { exec } from 'child_process';

class FileHandler {
    constructor(converter, metaData) {
        this.converter = converter;
        this.metaData = metaData;
    }

    handleFileConversion(req, res) {
        const filePath = req.file.path;
        const outputFilePath = path.join('uploads', `${req.file.filename}.mp3`);

        console.log(`Starting conversion of ${filePath} to ${outputFilePath}`);

        this.converter.convertToMP3(
            filePath,
            outputFilePath,
            (progress) => {
                console.log(`Processing: ${progress.percent}% done`);
            },
            (outputFilePath, filePath) => {
                this.converter.checkOutputFile(outputFilePath, filePath, res);
            },
            (err) => {
                console.error(`Error during conversion: ${err}`);
                res.status(500).send('Conversion error');
            }
        );
    }

    handleFileMetadata(req, res) {
        const filePath = req.file.path;

        console.log(`Getting metadata for ${filePath}`);

        this.metaData.getMetaData(filePath, (metadata) => {
            if (metadata) {
                console.log('Metadata retrieved successfully:', metadata);
                res.json(metadata);
            } else {
                console.error('Failed to retrieve metadata.');
                res.status(500).send('Failed to retrieve metadata.');
            }
        });
    }

    handleChangeAudioChannel(req, res) {
        const filePath = req.file.path;
        const intermediateFilePath = path.join('uploads', `${req.file.filename}_intermediate.wav`);
        const outputFilePath = path.join('uploads', `${req.file.filename}_surround.m4a`);

        console.log(`Changing audio channels to surround sound for ${filePath}`);

        // Step 1: Convert MP3 to WAV
        const convertToWavCommand = `ffmpeg -i ${filePath} -y ${intermediateFilePath}`;
        console.log(`Spawned FFmpeg with command: ${convertToWavCommand}`);

        exec(convertToWavCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during WAV conversion: ${error}`);
                console.error(`FFmpeg stderr: ${stderr}`);
                res.status(500).send('WAV conversion error');
                return;
            }

            console.log(`FFmpeg stdout: ${stdout}`);

            // Step 2: Convert WAV to surround sound M4A
            const convertToSurroundCommand = `ffmpeg -i ${intermediateFilePath} -y -ac 6 -c:a aac ${outputFilePath}`;
            console.log(`Spawned FFmpeg with command: ${convertToSurroundCommand}`);

            exec(convertToSurroundCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error during surround sound conversion: ${error}`);
                    console.error(`FFmpeg stderr: ${stderr}`);
                    res.status(500).send('Surround sound conversion error');
                    return;
                }

                console.log(`FFmpeg stdout: ${stdout}`);
                res.download(outputFilePath, (err) => {
                    if (err) {
                        console.error(`Error sending file: ${err}`);
                        res.status(500).send('Error sending file');
                    }
                });
            });
        });
    }

}

export default FileHandler;