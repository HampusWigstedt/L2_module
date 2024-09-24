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
}

export default MetaData