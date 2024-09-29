import VideoResizer from './resizeVideo.js'
import Client from './client.js'
import AudioRemover from './removeAudio.js'

// const inputFilePath = 'test.mp4'
// const outputFilePath = 'resized.mp4'
// const width = 1920
// const height = 1080

// const resizer = new VideoResizer(inputFilePath, outputFilePath, width, height)
// resizer.resize()


// Example usage

// const client = new Client('localhost', 3000)
// client.setFilePath('test.mp4')

// Perform actions

// client.convertFile()
// client.getMetadata()
// client.changeAudioChannel()

// Example usage for removing audio
const videoFilePath = 'test.mp4'
const outputFilePath = 'output/noAudio.mp4'

const remover = new AudioRemover(videoFilePath, outputFilePath)
remover.removeAudio()