import ffmpeg from 'fluent-ffmpeg'

class VideoResizer {
    constructor(inputFilePath, outputFilePath, width, height) {
        this.inputFilePath = inputFilePath
        this.outputFilePath = outputFilePath
        this.width = width
        this.height = height
    }

    resize() {
        ffmpeg(this.inputFilePath)
            .size(`${this.width}x${this.height}`)
            .output(this.outputFilePath)
            .on('end', () => {
                console.log(`Video successfully resized and saved as ${this.outputFilePath}`)
            })
            .on('error', (err) => {
                console.error('Error resizing video:', err)
            })
            .run()
    }
}

export default VideoResizer