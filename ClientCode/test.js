import Client from './client.js'

// Example usage

const client = new Client()

// Perform actions

// client.convertFile('test2.mp4')
// client.getMetadata('output_surround.mp3')
// client.StereoToSurround('output.mp3')
// client.resizeVideo('test2.mp4', 480, 320)
client.removeAudio('test2.mp4')
