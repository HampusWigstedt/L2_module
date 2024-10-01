import ffmpeg from 'fluent-ffmpeg'

// Class to handle audio removal from a video file
class AudioRemover {
    constructor(inputFilePath, outputFilePath) {
        this.inputFilePath = inputFilePath
        this.outputFilePath = outputFilePath
    }

    // Method to remove audio from the video file
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
            })

            .on('error', (err) => {
                console.error('Error removing audio:', err.message)
                onError(err)
            })

            .run()
    }
}

export default AudioRemover