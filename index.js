import { Converter } from "./converter.js"

// Example usage:
const converter = new Converter()
const inputFilePath = './converter.js' // Path to the input text file
const outputFilePath = './output.md' // Path to the output Markdown file

// Read the content from the text file
const textContent = converter.readTextFile(inputFilePath)

// Write the content to the Markdown file
converter.writeMdFile(outputFilePath, textContent)

