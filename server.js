const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server)
const { v4: uuidV4 } = require("uuid")
const path = require("path")

// Page created by the server (in the '/views' folder)
// (might change from ejs to JSX/react? or send data to a certain page)
// https://github.com/reactjs/express-react-views
// app.set("view engine", "ejs")

// Javascript + css folder
app.use(express.static(__dirname + "/build/"))  

//Redirects the user the root "/" so there are no navigation errors.
app.get("/", (req, res) => {
    res.redirect("/")
})

//var participants = {};

//Event listener for when user connects to localhost:3000
io.on("connection", socket => {
    //Pass the roomId and userId when a user joins a room
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId, userId)
        //join the room with the 
        socket.join(roomId)
        //Broadcast the "user-connected" event, to trigger a trigger in "script.js" 
        socket.to(roomId).broadcast.emit("user-connected", userId)
        //When the user disconnects, broadcast the "user-disconnected" event, to trigger a trigger in "script.js" 
        socket.on("disconnect", () =>{
            socket.to(roomId).broadcast.emit("user-disconnected", userId)
        })
    })
    
    socket.emit("your id", socket.id)

    socket.on("send message", body => {
        io.emit('message', body)
    })

    socket.on("send canvas state", body => {
        io.emit('canvasState', body)
    })

    socket.on("take control", userID => {
        io.emit('control switch', userID)
    })
})

// Application hosted on 'localhost:4000'
server.listen(4000, () => console.log("Listening on port 4000"))