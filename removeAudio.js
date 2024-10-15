import ffmpeg from 'fluent-ffmpeg';
import FileDeleter from './deleteTempFiles.js';

class AudioRemover {
    constructor(inputFilePath, outputFilePath) {
        this.inputFilePath = inputFilePath;
        this.outputFilePath = outputFilePath;
        this.fileDeleter = new FileDeleter();
    }

    removeAudio(onSuccess, onError) {
        this.initializeFfmpegProcess(onSuccess, onError).run();
    }

    initializeFfmpegProcess(onSuccess, onError) {
        return ffmpeg(this.inputFilePath)
            .noAudio()
            .outputOptions('-movflags', 'faststart') // Ensure moov atom is at the beginning of the file for streaming
            .output(this.outputFilePath)
            .on('start', this.onFfmpegStart)
            .on('end', () => this.onFfmpegEnd(onSuccess))
            .on('error', (err) => this.onFfmpegError(err, onError));
    }

    onFfmpegStart(commandLine) {
        console.log(`Spawned FFmpeg with command: ${commandLine}`);
    }

    onFfmpegEnd(onSuccess) {
        console.log(`Audio successfully removed and saved as ${this.outputFilePath}`);
        onSuccess(this.outputFilePath);
        this.fileDeleter.deleteAllFiles(); // Delete all temporary files
    }

    onFfmpegError(err, onError) {
        console.error('Error removing audio:', err.message);
        onError(err);
    }
}

export default AudioRemover;