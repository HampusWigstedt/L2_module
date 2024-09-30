import ffmpeg from 'fluent-ffmpeg'

class VideoResizer {
    constructor(inputFilePath, outputFilePath, width, height) {
        this.inputFilePath = inputFilePath
        this.outputFilePath = outputFilePath
        this.width = width
        this.height = height
    }

    resize(onSuccess, onError) {
        const validationError = this.validateDimensions(this.width, this.height)
        if (validationError) {
            onError(new Error(validationError))
            return
        }

        ffmpeg(this.inputFilePath)
            .size(`${this.width}x${this.height}`)
            .outputOptions('-movflags', 'faststart') // Ensure moov atom is at the beginning of the file for streaming
            .output(this.outputFilePath)
            .on('end', () => {
                console.log(`Video successfully resized and saved as ${this.outputFilePath}`)
                onSuccess(this.outputFilePath)
            })
            .on('error', (err) => {
                console.error('Error resizing video:', err)
                onError(err)
            })
            .run()
    }

    validateDimensions(width, height) {
        if (!width || !height) {
            return 'Width and height must be specified.'
        }

        if (isNaN(width) || isNaN(height)) {
            return 'Width and height must be numbers.'
        }

        if (width <= 0 || height <= 0) {
            return 'Width and height must be positive numbers.'
        }

        return null
    }
}

export default VideoResizer