EasyFFM

Easy ffm is a web api that allows easy access to ffmpeg and its main functionality.
Our goal is to make the usage of ffmpeg easier and more accessable.
We also want a fast way to implement file convertion into any program.

The host of the program needs to have FFMPEG installed on their computer or server.

When server is running, any computer with a reach to the api can access the methods and use them on their own computer without having ffmpeg installed on their system. Making it easy to use ffmpeg in any system or project.


Launch app in bash terminal

Test on remote PC - node client.js path/to/your/file.mp4 192.168.1.127 3000

Test on This PC - node client.js path/to/your/file.mp4 localhost 3000



"file=@test.mp4" http://localhost:3000/convert --output output.mp3
