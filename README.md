# Videsign - Creative, Video conferencing Software

Authors: Connor Brookfield and Charlie Conneely

## Project Outline

For our final year project, we decided to create a real-time, peer to peer, video conferencing application with a collaborative whiteboard (canvas), aptly named "Videsign". 
It allows users to conduct a video conference with the added benefit of a collaborative whiteboard to design and convey ideas visually, in an attempt to emulate the physical conferencing experience that has become widely unavailable due to Covid 19 restrictions.

### Feature Credits
The video chatting feature of this application was developed by Connor Brookfield,
the canvas feature was developed by Charlie Conneely, and the server side aspect of this project was developed by both Connor Brookfield and Charlie Conneely.

## Repository contents
This repository contains several files. Listed below are the non-boiler-plate files, folders and their functions;
1. ```/src``` - Contains the JavaScript/React/CSS/SCSS files responsible for the operation and structure of the React application.
2. ```server.js``` - This JavaScript file is responsible for the server side section of the application.
3. ```README.md``` - Contains useful information about this repository, and operating the applications/files present.
4. ```.gitignore``` - This file contains files and folders that don't get uploaded when pushing to this Github repository.
5. ```Screencast.mp4``` - Video file in which Connor Brookfield discusses the project and demonstrates the compilation, the running of the application, and how the application can be used. Note that in the screencast, the application is run on the same browser instance so the cookies are shared, this results in the toolbox's "Take Control" button being executed on both clients at the same time. When an incognito window or another browser is used, the issue is not apparent. 
6. ```Dissertation.pdf``` - The dissertation for our final year project.
7. ```/Dissertation``` - The folder containing all the LaTex files and resources required to create the dissertation. 

## How to Build, Run and Deploy the application.
### To build our React application, you must;
1. Download and install [Node package manager (NPM)](https://www.npmjs.com/get-npm).
2. Clone this GitHub repo to a desired folder.
3. Navigate to the `final-year-project` directory within that folder, open a terminal or command prompt window and type ```npm install``` which will install all the dependancies required to run this application.
4. Once the dependancies have been successfully installed, create a build of the application by running the command ```npm run build```
### To run the application after the build, you must;
1. Open a terminal or command prompt window within the `final-year-project` directory, and type ```node server.js```
2. Open any Chromium or Firefox based browser on either mobile phone or desktop and navigate to the URL; ```localhost:3000```
### To deploy the application for network independant use, you must;
1. Build and make sure that the application is running as shown in the previous steps.
2. Download [ngrok](https://ngrok.com/download) for your operating system.
3. Place the ```ngrok``` executable in the ```final-year-project``` folder.
4. Open a terminal or command prompt window in the ```final-year-project``` folder.
5. If on Windows, type; ```ngrok.exe http 3000```
6. If on Linux, type; ```./ngrok http 3000```
7. When ```ngrok``` is run, it should provide you with a URL. This URL can be sent to peer, the peer can then video chat with you without having to download anything other than a compatible browser. 