import h from './helpers.js';

window.addEventListener( 'load', () => {

    const username = $.cookie('name') ;  
    const usermail = $.cookie('email'); 

    document.getElementsByClassName("user-name")[0].innerText = username;
    document.getElementById("user-email").innerText = usermail ;

    localStorage.setItem( 'username', username );
    localStorage.setItem( 'email', usermail );

    if ( !usermail ) {
        window.location.replace(`${location.href.split('/')[0]}` + '/login' );
    }
    else {

        let socket = io( '/user' );

        var socketId = '';
        var myStream = '';

        socket.on( 'connect', () => {
            //set socketId
            socketId = socket.io.engine.id;

            socket.emit( 'subscribe', {
                socketId: socketId,
                username: username,
                usermail: usermail
            } );
        });

        socket.on('user-rooms',(data)=>{
            let base_room_container = document.getElementById("room-list-update");
            let base_container = document.querySelector("#page-chatrooms");

            // update number of rooms
            document.getElementById("updateRoomLength").innerText = data.length;

            for(var i=1;i<=data.length;i++){
                // add rooms in the dropdown menu
                base_room_container.innerHTML += `<li id="room-list-${data[i-1]}"><a href="#${data[i-1]}">Room ${i}</a></li>`;

                // add corresponding chat sections to each room
                base_container.innerHTML += createRoomChatHolder(data[i-1]);

            }

            Array.prototype.slice.call(document.getElementById("page-chatrooms").children).forEach((element)=>{

                document.getElementById("room-list-" + element.id).addEventListener('click',(e2)=>{

                    Array.prototype.slice.call(document.getElementById("page-chatrooms").children).forEach((ele)=>{
                        ele.hidden = true;
                    });
                    element.hidden = false;

                    // load chats only if chats are not loaded
                    if(document.getElementById("chat-messages-"+element.id).children.length === 0){
                        socket.emit("get-room-chats",element.id);
                }
                });


                //Chat Section #####################################################################
                // add listener, to append new messages to database
                addNewChatsToDatabase(element.id);

                // add copyToClipboard
                copyClipboard(element.id);

            });
                
        });

        // get room-chats -->
        // load data only when user wants to enter the specific room
        
        socket.on("room-chat-details",(data)=>{
            if(data.chats){
                let data_length = Object.keys(data.chats).length;
                if(data_length){
                    let ts = Object.keys(data.chats);
                    for(var i=0;i<data_length;i++){

                        if(data.chats[ts[i]].email === usermail){
                            // align it to the right
                            h.addChat({sender:data.chats[ts[i]].sender,
                                msg:data.chats[ts[i]].message,
                               timestamp:Number(ts[i]), room:data.room },'local', true);
                        }
                        else{
                            h.addChat({sender:data.chats[ts[i]].sender,
                                msg:data.chats[ts[i]].message,
                               timestamp:Number(ts[i]), room:data.room },'remote', true);
                        }
                    }
                }
            }
        });

        socket.on('chat',(data)=>{
            h.addChat({sender:data.sendername, msg:data.message, timestamp:data.timestamp, room:data.room },'remote', false);
        });


        document.getElementById('getACode').addEventListener('click',()=>{
            let randomRoomCode = h.generateRandomString();
            document.getElementById('showACode').innerHTML = `Room Code: <span style="color: #0e637d">${randomRoomCode}</span>`;
            document.getElementById('copyIcon').innerHTML = `<a class="mr-2 btn btn-sm btn-outline-info rounded-0 " title="Copy Invite Link" id="cc-meet-${randomRoomCode}">
            <i class="fas fa-2x fa-copy"></i></a>`;
            
            socket.emit('addNewRoomCode',{mail:usermail, roomName: randomRoomCode});

            //now add the new Room
            let base_room_container = document.getElementById("room-list-update");
            let base_container = document.querySelector("#page-chatrooms");

            // update number of rooms
            let currentRoomsLength = document.getElementById("updateRoomLength").innerText;
            document.getElementById("updateRoomLength").innerText = Number(currentRoomsLength) + 1 ;

            
            // add rooms in the dropdown menu
            base_room_container.innerHTML += `<li id="room-list-${randomRoomCode}"><a href="#${randomRoomCode}">Room ${Number(currentRoomsLength) +1}</a></li>`;

            // add corresponding chat sections to each room
            base_container.innerHTML += createRoomChatHolder(randomRoomCode);


            // add listener for newly added room
            addNewChatsToDatabase(randomRoomCode);

            //register this newly created room for user
            socket.emit('registerNewRoom',{email:usermail, room:randomRoomCode});

            document.getElementById("room-list-" + randomRoomCode).addEventListener('click',(e2)=>{

                Array.prototype.slice.call(document.getElementById("page-chatrooms").children).forEach((ele)=>{
                    ele.hidden = true;
                });
                document.getElementById(randomRoomCode).hidden = false;

            });

            // add copyToClipboard
            copyClipboard("meet-"+randomRoomCode);

        });

        // userful functions defined here #############################33

        function sendMsg(data){
            let snd = {
                room: data.room,
                timestamp: Date.now(),
                sendername : username,
                message : data.mssg,
                email: usermail
            };

            // send message to server;
            socket.emit("chat",snd);
            // also save your own chats
            h.addChat({sender:username, msg:data.mssg, timestamp:snd.timestamp, room:data.room },'local', false);

        }

        // a function, which takes ID and adds event listeners -> add chats to database.
        function addNewChatsToDatabase(elementId){

            document.getElementById( 'chat-input-'+ elementId ).addEventListener( 'keypress', ( e ) => {
        
                if ( e.which === 13 && ( e.target.value.trim() ) ) {
                    e.preventDefault();

                    sendMsg({room: elementId,
                        mssg: e.target.value } );

                    setTimeout( () => {
                        e.target.value = '';
                    }, 50 );
                }
            } );

            document.getElementById( 'chat-icon-send-'+ elementId ).addEventListener( 'click', ( e ) => {
                let text_elem = document.getElementById( 'chat-input-'+ elementId );
                if( text_elem.value !== '' ){
                    e.preventDefault();

                    sendMsg({room: elementId,
                            mssg: text_elem.value } );

                    setTimeout( () => {
                        text_elem.value = '';
                    }, 50 );
                }
            } );
        }

        // create placeholders for chats, parameter --> roomName
        function createRoomChatHolder(roomName){
            return `
                <div id ="${roomName}"  class="row justify-content-center" hidden>
                    <div class="col-10 pt-2">
                        <a class="btn btn-md btn-outline-info float-right rounded-0 " href="/join?room=${roomName}"> Join meet</a>
                        
                        <div class="row text-center">
                            <h5 class="my-auto p-2" >Room Code: <span style="color:#5bc0de">${roomName}</span></h5>
                            <a class="mr-2 btn btn-sm btn-outline-info rounded-0 " id="cc-${roomName}" title="Copy Invite Link" ><i class="fas fa-2x fa-copy"></i></a>
                        </div>
                        
                    </div>

                    <div class="col-md-9  px-1 d-print-none mb-2" 
                        style="border-radius:1%;margin-top:16px;height: 88vh;border: 1px solid #5bc0de;" id='chat-pane'>
                    
                        <div class="col-12 text-center h3 mb-3 mt-2">CHAT</div>

                        <div id='chat-messages-${roomName}' style = " overflow-y: scroll;height: 73vh;overflow: hidden;" ></div>

                        <div class="mb-2 px-2 input-group" style="position: absolute; bottom: 0;" >
                            <input type="text" id='chat-input-${roomName}' class="col-11 form-control rounded-2 border-info" name="lname" placeholder="Type here...">
                            <i class="fa my-2 mx-2 fa-paper-plane btn btn-outline-secondary btn-sm" aria-hidden="true" id="chat-icon-send-${roomName}"></i>
                        </div>
                    </div>
            
                </div>`;
        }

        // adds event listner to copy the room invite link on click 
        function copyClipboard(roomName){
            // when copy to clipboard is clicked --->
            document.getElementById('cc-' + roomName).addEventListener('click',()=>{
                const el = document.createElement('textarea');
                let splt = roomName.split("meet-");
                if(splt.length === 2){
                    el.value = location.href.split("/dashboard")[0] + "/login?room=" + roomName.split("meet-")[1] ;
                }
                else{
                    el.value = location.href.split("/dashboard")[0] + "/login?room=" + roomName;
                }
                
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            });

        }
 
    }
} );
