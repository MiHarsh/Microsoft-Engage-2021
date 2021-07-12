export default {

    // So we need unique names to create different rooms everytime.
    // This function does exactly the same. Since there are no verifications
    // involved in our solution, hence this must be unique.

    generateRandomString() {
        const crypto = window.crypto || window.msCrypto;
        let array = new Uint32Array(1);
        let alphabets = "abcdefghiklmnopqrstuvwxyz";
        let meeting_code = "";
        let random_numbers = String(crypto.getRandomValues(array)[0]);
        for(let i=0;i< random_numbers.length;i++){

            if(i === 3 || i == 7 ){
                meeting_code+="-";
            }

            meeting_code += alphabets[Number(random_numbers[i])];
        };
        return meeting_code;
    },

    // whether to collapse or expand admit request box.
    collapse_admit(state){
        document.getElementById('user-admit').hidden = state;
        document.getElementById('view-all').hidden = !state;
        document.getElementById('admit-all').hidden = state;
    },


    // Once a user disconnects, remove his video, and
    // adjust the video sizes of other elements.
    closeVideo( elemId,socket ) {
        if ( document.getElementById( elemId ) ) {
            socket.emit("removeMyName",elemId);
            document.getElementById( elemId ).remove();
            this.adjustVideoElemSize();
        }
    },

    // set userNames helper function, maps videos with usernames
    setUserNames(mapSocketWithNames){
        let current_users =  document.getElementById('videos').children;
        for(var i=0;i<current_users.length;i++){

            if(current_users[i].children.length === 3){
                let id_user = current_users[i].id;
                let nameDiv = current_users[i].children[2];
                nameDiv.innerHTML = `${mapSocketWithNames[id_user]}`;
                
            }
        };
    },
    


    // page focus, scroll chat if focus on chat.
    pageHasFocus() {
        return !( document.hidden || document.onfocusout || window.onpagehide || window.onblur );
    },

    // returns room name and id from the given url
    getQString( url = '', keyToReturn = '' ) {
        url = url ? url : location.href;
        let queryStrings = decodeURIComponent( url ).split( '#', 2 )[0].split( '?', 2 )[1];

        if ( queryStrings ) {
            let splittedQStrings = queryStrings.split( '&' );

            if ( splittedQStrings.length ) {
                let queryStringObj = {};

                splittedQStrings.forEach( function ( keyValuePair ) {
                    let keyValue = keyValuePair.split( '=', 2 );

                    if ( keyValue.length ) {
                        queryStringObj[keyValue[0]] = keyValue[1];
                    }
                } );

                return keyToReturn ? ( queryStringObj[keyToReturn] ? queryStringObj[keyToReturn] : null ) : queryStringObj;
            }

            return null;
        }

        return null;
    },

    // Check if audio/video devices present or not
    userMediaAvailable() {
        return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
    },

    // return media devices to use local peer's video
    // every peer will have their local videos sent to the Server, 
    // and server would decide what to do next.

    getUserFullMedia() {
        if ( this.userMediaAvailable() ) {
            return navigator.mediaDevices.getUserMedia( {
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            } );
        }

        else {
            throw new Error( 'User media not available' );
        }
    },

    // if user turns the video off, get their audios only
    getUserAudio() {
        if ( this.userMediaAvailable() ) {
            return navigator.mediaDevices.getUserMedia( {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            } );
        }

        else {
            throw new Error( 'User media not available' );
        }
    },

    // screen share media, return current screen status of user.
    // each user will have their own screen sharing videos. The output from this 
    // would be sent to other peers. 

    shareScreen() {
        if ( this.userMediaAvailable() ) {
            return navigator.mediaDevices.getDisplayMedia( {
                video: {
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            } );
        }

        else {
            throw new Error( 'User media not available' );
        }
    },

    // ice servers, (stun and turn)
    getIceServer() {
        return {
            iceServers: [
                {
                    urls: ["stun:eu-turn4.xirsys.com"]
                },
                {
                    username: "ml0jh0qMKZKd9P_9C0UIBY2G0nSQMCFBUXGlk6IXDJf8G2uiCymg9WwbEJTMwVeiAAAAAF2__hNSaW5vbGVl",
                    credential: "4dd454a6-feee-11e9-b185-6adcafebbb45",
                    urls: [
                        "turn:eu-turn4.xirsys.com:80?transport=udp",
                        "turn:eu-turn4.xirsys.com:3478?transport=tcp"
                    ]
                }
            ]
        };
    },



    addChat( data, senderType, fromDatabase ) {
        let chatMsgDiv;
        let time;
        if(data.room){
            // chat is from user homepage
            chatMsgDiv = document.querySelector( '#chat-messages-'+ data.room );
        }
        else{
            chatMsgDiv = document.querySelector( '#chat-messages' );
        }
        time = moment().format( 'Do MMMM, YYYY h:mm a' );


        if(data.timestamp){
            time = moment(data.timestamp).format( 'Do MMMM, YYYY h:mm a' );
        }

        
        let contentAlign = 'justify-content-end';
        let senderName = 'You';
        let msgBg = 'bg-light';
        let marginContent = 'mr-1';

        if ( senderType === 'remote' ) {

            contentAlign = 'justify-content-start';
            marginContent = 'ml-1';
            senderName = data.sender;
            msgBg = '';

            // notify when new message arrives, only in meet
            if(!fromDatabase && !data.room ){
                // silent data loading when retrieving from database
                let audio = new Audio('../assets/tones/message.mp3');
                audio.play();
    
                this.toggleChatNotificationBadge();
            }


        }

        let infoDiv = document.createElement( 'div' );
        infoDiv.className = 'sender-info';

        infoDiv.innerHTML = `${ senderName } - ${time}`;

        let colDiv = document.createElement( 'div' );
        colDiv.className = `col-10 card chat-card msg text-info ${ msgBg }`;
        colDiv.innerHTML = `<b>${xssFilters.inHTMLData( data.msg ).autoLink( { class: "text-info" , target: "_blank", rel: "nofollow"})}</b>`;

        let rowDiv = document.createElement( 'div' );
        rowDiv.className = `row ${ marginContent } ${ contentAlign } mb-2`;


        colDiv.appendChild( infoDiv );
        rowDiv.appendChild( colDiv );
        chatMsgDiv.appendChild( rowDiv );


        if ( this.pageHasFocus ) {
            rowDiv.scrollIntoView();
        }
    },

    // when new message arrives
    toggleChatNotificationBadge() {
        if ( document.querySelector( '#chat-pane' ).classList.contains( 'chat-opened' ) ) {
            document.querySelector( '#new-chat-notification' ).setAttribute( 'hidden', true );
        }

        else {
            document.querySelector( '#new-chat-notification' ).removeAttribute( 'hidden' );
        }
    },



    replaceTrack( stream, recipientPeer ) {
        let sender = recipientPeer.getSenders ? recipientPeer.getSenders().find( s => s.track && s.track.kind === stream.kind ) : false;

        if(sender){
            sender.replaceTrack( stream );
        }
    },

    // this adds effects to when we share the screen, for now

    toggleShareIcons( share ) {
        let shareIconElem = document.querySelector( '#share-screen' );

        if ( share ) {
            shareIconElem.setAttribute( 'title', 'Stop sharing screen' );
            shareIconElem.children[0].classList.add( 'text-primary' );
            shareIconElem.children[0].classList.remove( 'text-white' );
        }

        else {
            shareIconElem.setAttribute( 'title', 'Share screen' );
            shareIconElem.children[0].classList.add( 'text-white' );
            shareIconElem.children[0].classList.remove( 'text-primary' );
        }
    },


    toggleVideoBtnDisabled( disabled ) {
        document.getElementById( 'toggle-video' ).disabled = disabled;
    },


    // to pinn to screen
    maximiseStream( e ) {
        let elem = e.target.parentElement.previousElementSibling;
        elem.requestFullscreen() || elem.mozRequestFullScreen() || elem.webkitRequestFullscreen() || elem.msRequestFullscreen();
    },


    singleStreamToggleMute( e ) {
        if ( e.target.classList.contains( 'fa-microphone' ) ) {
            e.target.parentElement.previousElementSibling.muted = true;
            e.target.classList.add( 'fa-microphone-slash' );
            e.target.classList.remove( 'fa-microphone' );
        }

        else {
            e.target.parentElement.previousElementSibling.muted = false;
            e.target.classList.add( 'fa-microphone' );
            e.target.classList.remove( 'fa-microphone-slash' );
        }
    },

    // save the recordings
    saveRecordedStream( stream, user ) {
        let blob = new Blob( stream, { type: 'video/webm' } );
        let file = new File( [blob], `${ user }-${ moment().unix() }-record.webm` );

        saveAs( file );
    },


    toggleModal( id, show ) {
        let el = document.getElementById( id );

        if ( show ) {
            el.style.display = 'block';
            el.removeAttribute( 'aria-hidden' );
        }

        else {
            el.style.display = 'none';
            el.setAttribute( 'aria-hidden', true );
        }
    },

    // whether to mirror local image or send as it is
    setLocalStream( stream, mirrorMode = true ) {
        const localVidElem = document.getElementById( 'local' );

        localVidElem.srcObject = stream;
        mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );
    },


    // this would adjust the size of the video
    adjustVideoElemSize() {
        let elem = document.getElementsByTagName( 'video' );
        let totalRemoteVideosDesktop = elem.length;
     
        let newWidth = totalRemoteVideosDesktop <= 2 ? '50%' : (
            totalRemoteVideosDesktop == 3 ? '33.33%' : (
                totalRemoteVideosDesktop <= 8 ? '25%' : (
                    totalRemoteVideosDesktop <= 15 ? '20%' : (
                        totalRemoteVideosDesktop <= 18 ? '16%' : (
                            totalRemoteVideosDesktop <= 23 ? '15%' : (
                                totalRemoteVideosDesktop <= 32 ? '12%' : '10%'
                            )
                        )
                    )
                )
            )
        );


        for ( let i = 0; i < elem.length; i++ ) {
            elem[i].parentElement.style.width = newWidth;
        }
    },

    // will display the popup --->
    askForPoll(){
        document.querySelector(".wrapper").hidden = false;
    },

};
