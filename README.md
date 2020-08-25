# Camera controller server

Camera controller server is an [electron](https://electronjs.org/) app 
running a WebSocket server built with [next.js](https://nextjs.org/) 
framework.

Only some camera settings are controlled with this app 
(limited by react-native-camera module) such as back/front camera 
toggle, Flash setting (auto/on/off/torch) and a couple of white balance 
options.

I made this because I wanted to use my phone as a web-cam for streaming 
using [Genymobile/scrcpy](https://github.com/Genymobile/scrcpy/releases)
to capture the screen.
This way, if I wanted to turn flash on or off without tapping on the 
screen, I could send a message to my phone through a WebSocket
connection and turn it on remotely.

There are no plans to use this to take pictures or video record at the
moment, but maybe I could incorporate those features in the future
___
# Try it
Try the camera app client using 
[Expo snack](https://snack.expo.io/@nastytakito/taco-remote-camera)

# Installation
1. Clone or download this repository
2. Go to project directory
3. Run `npm install`

# Running the application
There are two ways to run the app
- `npm run dev`: Runs only next.js application 
- `npm run electron`: Runs both next.js app and WebSocket server 
inside electron 

next.js runs on default port (3000) and WebSocket server runs on 
port 3001

# Building the app
I haven't done this step yet, so it's a TODO  
