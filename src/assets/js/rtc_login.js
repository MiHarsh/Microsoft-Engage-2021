let isAdmin = false;
let startTime = "";
import h from './helpers.js';

window.addEventListener( 'load', () => {

    console.log("entered ");

    const username = document.getElementsByClassName("user-name")[0].innerText;
    const usermail = document.getElementById("user-email").innerText.split(" ")[1];
    
    console.log(usermail);
    // const usermail = sessionStorage.getItem( 'userid' );

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

                base_container.innerHTML += ` <div id ="${data[i-1]}" hidden>
                    <div class="col-md-3  px-1 d-print-none mb-2 bg-white"style="border-radius:1%;margin-top:16px;" id='chat-pane'>
                    
                        <div class="col-12 text-center h3 mb-3 mt-2">CHAT</div>

                        <div id='chat-messages-${data[i-1]}'></div>

                        <div class="mr-auto ml-auto mb-2 input-group" >
                            <input type="text" id='chat-input-${data[i-1]}' class="form-control rounded-2 border-info" name="lname"placeholder="Type here...">
                            <i class="fa my-2 mx-1 fa-paper-plane btn btn-outline-secondary btn-sm" aria-hidden="true" id="chat-icon-send-${data[i-1]}"></i>
                        </div>
                    </div>
                    <a href="/join?room=${data[i-1]}"> Join meet</a>
                </div>`;

            }

            Array.prototype.slice.call(document.getElementById("page-chatrooms").children).forEach((element)=>{

                document.getElementById("room-list-" + element.id).addEventListener('click',()=>{

                    Array.prototype.slice.call(document.getElementById("page-chatrooms").children).forEach((ele)=>{
                        ele.hidden = true;
                    });
                    element.hidden = false;

                    // load chats only if chats are not loaded
                    if(document.getElementById("chat-messages-"+element.id).innerHTML === ""){
                        socket.emit("get-room-chats",element.id);
                    }


                    //Chat Section #####################################################################
                    // add new chats to the database

                    document.getElementById( 'chat-input-'+ element.id ).addEventListener( 'keypress', ( e ) => {
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
                
        });




        // get room-chats -->
        // load data only when user wants to enter the specific room
        
        socket.on("room-chat-details",(data)=>{
            if(data.chats){
                let data_length = Object.keys(data.chats).length;
                if(data_length){
                    for(var i=0;i<data_length;i++){
                        document.getElementById("chat-messages-"+ data.room).innerHTML += `<div> ${data.chats[Object.keys(data.chats)[i]]} </div>`;
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
            document.getElementById("chat-messages-"+ data.room).innerHTML += `<div> ${snd.message} </div>`;

        };
        
        socket.on('chat',(data)=>{
            console.log(data);
            document.getElementById("chat-messages-"+ data.room).innerHTML += `<div> ${data.message} </div>`;
        });
        







        // socket.on( 'chat', ( data ) => {
        //     h.addChat( data, 'remote' );
        // } );


    

        // function sendMsg( msg ) {
        //     let data = {
        //         room: room,
        //         msg: msg,
        //         sender: username
        //     };

        //     //emit chat message
        //     socket.emit( 'chat', data );

        //     //add localchat
        //     h.addChat( data, 'local' );
        // }

        
    }
} );
