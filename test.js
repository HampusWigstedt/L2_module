import Client from './client.js'
import AudioRemover from './removeAudio.js'

// Example usage

const client = new Client('localhost', 3000)
client.setFilePath('test.mp4')

// Perform actions

// client.convertFile()
// client.getMetadata()
// client.changeAudioChannel()
client.resizeVideo(480, 320)
// client.removeAudio()
