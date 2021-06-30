var socket = io("http://localhost:5000");
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let divVideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");

let roomName;
var creator = false;
var userStream;

var rtcPeerConnection;


// once the user clicks on join button
// two things will happen, either he hasn't 
// entered valid roomName or he'll join

joinButton.addEventListener("click", function () {
  roomName = roomInput.value;
  if (roomName == "") {
    alert("Please enter a room name");
  } 
  else {
    socket.emit("join", roomName);
  }
});


// when a new room is created or joined successfully, 
// get the user media,

socket.on("created", function(){
  creator = true;
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 320, height: 320 },
  })
  .then(function (stream) {
    /* use the stream */
    userStream = stream;
    divVideoChatLobby.style = "display:none";
    userVideo.srcObject = stream;
    userVideo.onloadedmetadata = function (e) {
      userVideo.play();
    };
  })
  .catch(function (err) {
    /* handle the error */
    alert("Couldn't Access User Media");
  });
});

// ready event is triggered, when a person joins 
// successfully. The person who is creator need not worry 
// about being ready.

socket.on("joined", function(){
  creator = false;
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 320, height: 320 },
  })
  .then(function (stream) {
    /* use the stream */
    userStream = stream;
    divVideoChatLobby.style = "display:none";
    userVideo.srcObject = stream;
    userVideo.onloadedmetadata = function (e) {
      userVideo.play();
    };
    socket.emit("ready",roomName);

  })
  .catch(function (err) {
    /* handle the error */
    alert("Couldn't Access User Media");
  });
});



socket.on("full", function(){
  alert("room is full, can't join");
});

// the very next step is to know the address,
// this is done using STUN servers.

var iceServers = {
  iceServers: [
    {urls: "stun:stun.services.mozilla.com"},
    {urls: "stun:stun1.l.google.com:19302"},
  ]
};

// when a person joins a room, will trigger the ready function,
// on server, which in turn is triggers the ready function on
// client side. A new RTCPeerConnection is made by the creator
// to all the peers inside the room.

socket.on("ready", function(){
  if(creator){
    rtcPeerConnection = new RTCPeerConnection(iceServers); // this is an interface
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.ontrack = OnTrackFunction;
    // now we also have to send our media streams.
    rtcPeerConnection.addTrack(userStream.getTracks()[0],userStream); // audio tracks
    rtcPeerConnection.addTrack(userStream.getTracks()[1],userStream); // video tracks
    // create offer, what we are sending-->
    rtcPeerConnection.createOffer((offer)=>{
      rtcPeerConnection.setLocalDescription(offer); // -- ?
      socket.emit("offer",offer,roomName);
        },(error)=>{
          console.lof(error);
      });
  }
});

// share ice candidates

function OnIceCandidateFunction(event){
  if(event.candidate){
    socket.emit("candidate",event.candidate,roomName);
  }
}

// ontrack event is triggered, when we start to get
// media streams from peers.

function OnTrackFunction(event){
  
  peerVideo.srcObject = event.streams[0];
    peerVideo.onloadedmetadata = function (e) {
      peerVideo.play();
    };
}



socket.on("candidate", function(candidate){
  var iceCandidate = new RTCIceCandidate(candidate);
  rtcPeerConnection.addIceCandidate(iceCandidate);
});


// when joined, offer is created, but when offer is recieved,
// answer event is done.

socket.on("offer", function(offer){
  if(!creator){
    rtcPeerConnection = new RTCPeerConnection(iceServers); // this is an interface
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.ontrack = OnTrackFunction;
    // now we also have to send our media streams.
    rtcPeerConnection.addTrack(userStream.getTracks()[0],userStream); // audio tracks
    rtcPeerConnection.addTrack(userStream.getTracks()[1],userStream); // video tracks
    // create offer, what we are sending-->
    rtcPeerConnection.setRemoteDescription(offer);
    rtcPeerConnection.createAnswer((answer)=>{
      rtcPeerConnection.setLocalDescription(answer);
      socket.emit("answer",answer,roomName);
        },(error)=>{
          console.lof(error);
      });
  }
});


socket.on("answer", function(answer){
  rtcPeerConnection.setRemoteDescription(answer);
});