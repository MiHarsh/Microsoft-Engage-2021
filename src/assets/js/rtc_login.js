let isAdmin = false;
let startTime = "";
import h from './helpers.js';



window.addEventListener( 'load', () => {

    console.log("entered ");
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

                base_container.innerHTML += ` 
                <div id ="${data[i-1]}" hidden>
                    <a class="btn btn-md btn-info mr-5 float-right rounded-0 " href="/join?room=${data[i-1]}"> Join meet</a>
                    <div class="col-md-3  px-1 d-print-none mb-2 bg-info"style="border-radius:1%;margin-top:16px;" id='chat-pane'>
                    
                        <div class="col-12 text-center h3 mb-3 mt-2">CHAT</div>

                        <div id='chat-messages-${data[i-1]}'></div>

                        <div class="mr-auto ml-auto mb-2 input-group" >
                            <input type="text" id='chat-input-${data[i-1]}' class="form-control rounded-2 border-info" name="lname"placeholder="Type here...">
                            <i class="fa my-2 mx-1 fa-paper-plane btn btn-outline-secondary btn-sm" aria-hidden="true" id="chat-icon-send-${data[i-1]}"></i>
                        </div>
                    </div>
                    
                </div>`;

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
                // add new chats to the database

                document.getElementById( 'chat-input-'+ element.id ).addEventListener( 'keypress', ( e ) => {
                    console.log(e);
                    if ( e.which === 13 && ( e.target.value.trim() ) ) {
                        e.preventDefault();

                        sendMsg({room: element.id,
                            mssg: e.target.value } );

                        setTimeout( () => {
                            e.target.value = '';
                        }, 50 );
                    }
                } );

                document.getElementById( 'chat-icon-send-'+element.id ).addEventListener( 'click', ( e ) => {
                    let text_elem = document.getElementById( 'chat-input-'+element.id );
                    if( text_elem.value !== '' ){
                        e.preventDefault();

                        sendMsg({room: element.id,
                                mssg: text_elem.value } );

                        setTimeout( () => {
                            text_elem.value = '';
                        }, 50 );
                    }
                } );


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

        };
        
        socket.on('chat',(data)=>{
            console.log(data);
            h.addChat({sender:data.sendername, msg:data.message, timestamp:data.timestamp, room:data.room },'remote', false);
        });
             
    }
} );
