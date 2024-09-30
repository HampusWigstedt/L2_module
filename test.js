import Client from './client.js'
import AudioRemover from './removeAudio.js'

// Example usage

const client = new Client('localhost', 3000)
client.setFilePath('output_surround.mp3')

// Perform actions

// client.convertFile()
client.getMetadata()
// client.changeAudioChannel()
// client.resizeVideo(720, 480)

// Example usage for removing audio
// const videoFilePath = 'test.mp4'
// const outputFilePath = 'output/noAudio.mp4'

// const remover = new AudioRemover(videoFilePath, outputFilePath)
// remover.removeAudio()