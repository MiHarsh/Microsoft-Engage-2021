const express = require('express');
const socket = require('socket.io');
const app = express();

// this server is not upgraded to sustain the connection i.e works on request/response
var server = app.listen(5000,()=>{
    console.log("Listening to port 5000");
});

app.use(express.static("public"));

var io = socket(server);


io.on("connection",(socket)=>{
    console.log("User has joined",socket.id);

    socket.on("join",(roomName)=>{
        var rooms = io.sockets.adapter.rooms;
        console.log(rooms);

        var room = rooms.get(roomName);

        if(room === undefined){
            socket.join(roomName);
            socket.emit("created");
        }
        else if(room.size === 1 ){
            socket.join(roomName);
            socket.emit("joined");
        }
        else{
            socket.emit("full");
        }
        console.log(rooms);

    });

    // every time a client is ready, ie. joined a room,
    // other clients must know this. why ? So that they 
    // could exchange their offers, and proceed further steps.
    // 1) User has to broadcast following things -->
    //    a) when joined
    //    b) ice candidates for communication
    //    c) offer
    //    d) answer

    socket.on("ready",(roomName)=>{
        console.log("Ready");
        socket.broadcast.to(roomName).emit("ready");
    });

    socket.on("candidate",(candidate,roomName)=>{
        console.log("candidate",candidate);
        socket.broadcast.to(roomName).emit("candidate", candidate);
    });

    socket.on("offer",(offer,roomName)=>{
        console.log("offer",offer);
        socket.broadcast.to(roomName).emit("offer", offer);
    });

    socket.on("answer",(answer,roomName)=>{
        console.log("answer",answer);
        socket.broadcast.to(roomName).emit("answer", answer);
    });



});
