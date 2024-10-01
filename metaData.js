import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'

class MetaData {
    getMetaData(filePath, onMetaData) {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                console.error(`Error getting metadata: ${err}`)
                return onMetaData(null)
            }
            onMetaData(metadata)
        });
    }

    StereoToSurround(filePath, outputFilePath, onProgress, onComplete, onError) {
        ffmpeg(filePath)
            .audioCodec('aac') // Use the AAC codec
            .audioChannels(6)
            .on('start', (commandLine) => {
                console.log(`Spawned FFmpeg with command: ${commandLine}`)
            })
            .on('progress', onProgress)
            .on('end', () => {
                console.log(`Conversion complete: ${outputFilePath}`)
                onComplete(outputFilePath, filePath);
            })
            .on('error', onError)
            .save(outputFilePath)
    }
}

export default MetaData