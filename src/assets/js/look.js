
// add meet code in description --
import h from './helpers.js';

// console.log(startTime);

document.getElementById("UpdateTime").innerText = new Date().toLocaleTimeString();
document.getElementById("meetLink").innerText   = " | " + h.getQString( location.href, 'room' );

async function updateTime(){
    document.getElementById("UpdateTime").innerText = new Date().toLocaleTimeString();
}

setInterval(()=>{
    updateTime();
},1000);

// ###################

