import Client from './client.js'

// Example usage

const client = new Client('localhost', 3000)

// Perform actions

// client.convertFile()
// client.getMetadata()
// client.StereoToSurround()
client.resizeVideo(480, 320)
// client.removeAudio()
