import ffmpeg from 'fluent-ffmpeg'
import FileDeleter from './deleteTempFiles.js'


class AudioRemover {
    constructor(inputFilePath, outputFilePath) {
        this.inputFilePath = inputFilePath
        this.outputFilePath = outputFilePath
        this.fileDeleter = new FileDeleter()
    }

    removeAudio(onSuccess, onError) {
        
        ffmpeg(this.inputFilePath)
            .noAudio()
            .outputOptions('-movflags', 'faststart') // Ensure moov atom is at the beginning of the file for streaming
            .output(this.outputFilePath)

            .on('start', (commandLine) => {
                console.log(`Spawned FFmpeg with command: ${commandLine}`)
            })

            .on('end', () => {
                console.log(`Audio successfully removed and saved as ${this.outputFilePath}`)
                onSuccess(this.outputFilePath)
                this.fileDeleter.deleteAllFiles() // Delete all temporary files
            })

            .on('error', (err) => {
                console.error('Error removing audio:', err.message)
                onError(err)
            })

            .run()
    }
}

export default AudioRemover