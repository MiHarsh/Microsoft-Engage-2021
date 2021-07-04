// to store names mapped with their socket Ids-->
var mapSocketWithNames = {};
let adminOfRoom = {};
var vote_counts = {} ;

// #############################


// this is built on express Server

let express = require( 'express' );
let app = express();
let socketio = require( 'socket.io' );

const expressServer = app.listen(3000);
const io = socketio(expressServer);

let path = require( 'path' );
let favicon = require( 'serve-favicon' );
const { connected } = require('process');
const { join } = require('path');
const { isDate } = require('util');


app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );


// whenever get request is recieved on Server on join endpoint, render index.html file
app.get( '/join', ( req, res ) => {
    res.sendFile( __dirname + '/index.html' );
});

// when /stream namespace would be connected, then a stream callback is given 
// What do you expect it to do ?

// -->
// the server would listen to any message which is sent to server, also it would listen to other 
// socket to join, would have details such as their socket ids, as well as send datas to different
// peoples

// What does that callback actually do?
 

io.of( '/stream' ).on( 'connection', (socket)=>{
    socket.on( 'subscribe', ( data ) => {

        socket.join( data.socketId ); // only join the sockets, room will be joined once admin admits.

        // at the beginning, subscribe to admin only 
        if(!socket.adapter.rooms[data.room]){
            //subscribe/join a room
            socket.join( data.room );
        
            adminOfRoom[data.room] = data.socketId;

            // if only single user is present, he'll be admin --->
            socket.emit('iAmAdmin');

            console.log(socket.adapter.rooms);
        }
        else{
            //Inform admin in the room of new user's arrival
            socket.to(adminOfRoom[data.room]).emit('request-admin',data); // ask admin for entering to room.
        }


        // if a room doesn't exist, then vote_counts should be zero

        if(!vote_counts[data.room]){
            vote_counts[data.room] = 0;
        }

        // map name and socketID
        mapSocketWithNames[data.socketId] = data.username;

    });

    // if access is granted, the user can connect// here this socket is admin one
    // so admin would inform the requesting participant that -- access has been granted
    socket.on('access-granted',(data)=>{
        socket.to( data.socketId ).emit( 'access has been granted',data);
    });

    // after access has been granted, join the room, and inform other users;
    socket.on('alert-other-users',(data)=>{

        // participants join the room
        socket.join( data.room );
        socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
    });

    // if admin denies the permission
    socket.on('access-denied',()=>{
        console.log("Access denied by user");
    });

    // send details of new user to previously present sockets
    // contains --> to and sender 
    // to is socket ids which are present previously
    // and sender is new one

    socket.on( 'newUserStart', ( data ) => {
        socket.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
    } );


    // what a sdp is ? What do we do with that information ?
    // sdp is session description protocol, contains all the information about medias, streams etc

    socket.on( 'sdp', ( data ) => {
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    } );

    // once the public address are known using stun and turn servers, we share ice candidates to
    // create the connection.

    socket.on( 'ice candidates', ( data ) => {
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    } );


    // simple socket.io chat app, here only one namespace and room is present.  
    socket.on( 'chat', ( data ) => {

        // send message only if socket is present in the room
        // ie. user has admitted him

        if(socket.adapter.rooms[data.room].sockets[socket.id] ){
            socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
        }

        
    } );


    // remove User Name from mapSocketWith Names 

    socket.on("removeMyName",(elemId)=>{
        if(mapSocketWithNames[elemId]){
            delete mapSocketWithNames[elemId];
        }
    });

    // send usernames to clients -->
    socket.on('UpdateNamesOfUsers',()=>{
        socket.emit('UpdateNamesOfUsers',mapSocketWithNames);
    });

    socket.on('sendPollToEveryUser',(room)=>{
        socket.to(room).emit("openYourPolls");
    });

    socket.on('recievedPoll',(data)=>{

        vote_counts[data.room] += data.vote;

        if(2*vote_counts[data.room] +1 >socket.adapter.rooms[data.room].length){
            socket.to(data.room).emit("adminGiveABreak");
            vote_counts[data.room] = 0;
        }
        
    });




});


