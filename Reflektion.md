# Code Quality Reflection

## Meaningful Names

| Name and explination | Reflection |
|----------------------|----------|
| **Convert**  Class name for mp4 -> mp3 convertion           |   **Avoid Disinformation:** The Converter class may be interpreted as a class that can convert files in general(wich is the main idea in the end) it only converts a mp4 file to a mp3 file in testing cases. A more meaningful name would be Mp4ToMp3 or ConvertToMp3.      |
|      **ext** Variable name in Server.js                |   **Use Pronounceable and Searchable Names:** ext is a variable for holdin the name extension of a file when we use extname method from the path package to easily get the file name extension of a file. To make this name more readable and searchable extensionName or fileExtension could have been used.      |
|      **filePath** Parameter name for method convertToMp3                |    **Make Meaningful Distinctions:** This is a bit of a reach but i still think its a important analysis. filepath is the path to the file that we want to convert, which most times would be an alright name. The problem is that we also take in the parameter **utputFilePath** which specifes where the file should be sent. I would say the name inputFilePath would be way more non-trivial, to quote the book.     |
|     **deleteAllFiles** Method name in FileDeleter class                |  **Avoid Disinformation:** I think the issue with the naming is pretty self explanitory if you read the file name before the method name. The method deletes the temp files stored on the server when changing/converting the files. The easy fix would be renaming the method to deleteTempFiles. deleteAllFiles is very disinformative.        |
|           **resize** Method in VideoResizer class          |  **Use Intention-Revealing Names:** I think the naming of this method is pretty vague. We do explain the intent of the method but what are we really resizeing? We could resize everything from file size to duration. I think naming this method changeResolution or ChangeVideoDimension would be more descriptive of the methods intent.       |

## Reflection
> I would say im pretty good at naming my code for the most part. There are more occasions of me getting stuck trying to figure out a name for somthing then the opposite. The biggest things i will take with me in my coding is **Use Intention-Revealing Names.** When i code i, like most other programmers, have a vision in my head over the system and how it works. So in my head it's obvious that the method resize() will change the resolution size of a video as that is the only resizeing im doing in the current state of the program. Same goes for deleteAllFiles(). I don't have much to criticize in this chapter. It's great to reflect on things like naming that, in the grand scheme feel like small issues but could become bigger problems when we colaborate or when we further develop our programs.
>

## Functions

| Name of method | Ammount of lines and link | Reflection |
|----------|----------|----------|
| **handleRemoveAudio**         |  [Code](https://github.com/HampusWigstedt/L2_module/blob/main/handlers.js) 27 lines       |          |
|  **handleStereoToSurround**        |   [Code](https://github.com/HampusWigstedt/L2_module/blob/main/handlers.js) 23 lines       |          |
|   **resize**       |   [Code](https://github.com/HampusWigstedt/L2_module/blob/main/resizeVideo.js) 23 lines       |          |
|   **removeAudio**       |   [Code](https://github.com/HampusWigstedt/L2_module/blob/main/ClientCode/client.js) 22 lines       |          |
|    **resizeVideo**      |     [Code](https://github.com/HampusWigstedt/L2_module/blob/main/ClientCode/client.js) 21 lines     |          |