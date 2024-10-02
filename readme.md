# EasyFFM

## Description

Easy ffm is a web api that allows easy access to ffmpeg and its main functionality.
Our goal is to make the usage of ffmpeg easier and more accessable.
We also want a fast way to implement file convertion and manipulation into any program.

When server is running, any computer with a reach to the api can access the methods and use them on their own computer without having ffmpeg installed on their system. Making it easy to use ffmpeg in any system or project.


## Install

### Client Usage

1. Download EasyFFM ClientCode folder from the github repository.

2. Install dependencies with npm install in the console.

```javascript
npm install
```

### Host the API localy

1. Download the EasyFFM repository.

2. Install dependencies with npm install in the console.

3. If convertion on same pc. Use below. Port can be specified in index.js file.

```javascript
const client = new Client('localhost', port)
```
4. If convertion on another pc on the same network, find your ipv4 adress and use below. Port can be specified in index.js file.

```javascript
const client = new Client('ipv4', port)
```

5. Install ffmpeg on your system. 

## Usage

1. Install the client code
2. Create a instance of the client program

```javascript
const client = new Client()
```

3. Call methods to change your files



## Methods

Converts a mp4 file into a mp3 file
```javascript
client.convertFile(PathToYourFile)
```

Logs the metadata object of the specified file
```javascript
client.getMetadata(PathToYourFile)
```

Converts a mp3 file with Stereo sound into mp3 with 5.1 surround sound
```javascript
client.StereoToSurround(PathToYourFile)
```

Resize a mp4 video
```javascript
client.resizeVideo(PathToYourFile, WidthInPixels, HeightInPixels)
```

Remove the audio from mp4 file
```javascript
client.removeAudio(PathToYourFile)
```

## Current Bugs

There are no known bugs as of the writing of this document.

## Language and Dependencies

EasyFFM is written in Javascript (ES6)

The client code have dependencies towards Axios as the client code has Axios calls that automatically sends requests to the api when the methods are launched.
The program also utilizes 'fs' and 'form-data' for file management.

The server side of the project is dependent on ffmpeg and fluent-ffmpeg. ffmpeg for the actions of the program & fluent-ffmpeg for the .on methods that make it easier for actions and logs at different points in the convertion process. 

Express is used for the web framework and Multer is used for uploading files through express. 

## Version

The current version of EasyFFM is '1.0.0'

The project follows the Semantic Version System (Major,Minor,Patch)

## Contributions

As of now we won't accept contributions.

## Code Example
Below is an example of how to convert a mp4 file to an mp3 file with surround sound then log the metadata of the file to see that the convertion has worked correctly.
```javascript
import Client from './client.js'

const easyFFM = new Client()

easyFFM.convertFile(MyVideo.mp4)

easyFFM.StereoToSurround(MySound.mp3)

easyFFM.getMetadata(MySoundSurround.mp3)
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Writers Note

EasyFFM was developed for the course "Introduction to software quality" at Linnéus University. The assignment implied that the student should create a Lib or Web-api that could help other programmers in their work. The projects goal was to make it easier to manipulate video and sound files when handeling and changing these types of files.
