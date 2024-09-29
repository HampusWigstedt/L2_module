import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'

class AudioRemover {
    constructor(inputFilePath, outputFilePath) {
        this.inputFilePath = inputFilePath
        this.outputFilePath = outputFilePath
    }

    removeAudio() {
        // Ensure the output directory exists
        const outputDir = path.dirname(this.outputFilePath)
        if (!fs.existsSync(outputDir)) {
            console.log(`Creating output directory: ${outputDir}`)
            fs.mkdirSync(outputDir, { recursive: true })
        } else {
            console.log(`Output directory already exists: ${outputDir}`)
        }

        ffmpeg(this.inputFilePath)
            .noAudio()
            .output(this.outputFilePath)
            .on('start', (commandLine) => {
                console.log(`Spawned FFmpeg with command: ${commandLine}`)
            })
            .on('end', () => {
                console.log(`Audio successfully removed and saved as ${this.outputFilePath}`)
            })
            .on('error', (err) => {
                console.error('Error removing audio:', err.message)
            })
            .run()
    }
}

export default AudioRemover