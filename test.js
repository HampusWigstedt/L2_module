import VideoResizer from './resizeVideo.js'

const inputFilePath = 'test.mp4'
const outputFilePath = 'resized.mp4'
const width = 1920
const height = 1080

const resizer = new VideoResizer(inputFilePath, outputFilePath, width, height)
resizer.resize()
