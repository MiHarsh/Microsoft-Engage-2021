
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


// ##################################################################################
// This js is functional for -- Have a break -- functionality
// ##################################################################################

// function poll is taken from --> https://codepen.io/abadu/pen/RJvJQZ
// class poll {
//     constructor(question, answers, options) {
//       const defaultOptions = {};
//       this.options = Object.assign({}, defaultOptions, options);
//       this.history = [];
//       this.possibleAnswers = answers;
//     }
  
//     clear() {
//       this.history = [];
//     }
  
//     get results() {
//       let numberOfVotes = this.history.length,
//           votesResults = [];
//       Object.keys(this.possibleAnswers).forEach(answerId => {
//         let answerIdCounter = 0;
//         let voters = [];
//         this.history.forEach(vote => {
//           if (answerId == vote.id) {
//             answerIdCounter++;
//             voters.push(vote.name);
//           }
//         });
//         let percentOfAllVotes = answerIdCounter / numberOfVotes * 100;
//         let formatedPercent = isNaN(percentOfAllVotes) ? 0 : parseFloat(percentOfAllVotes).toFixed(3).slice(0, -1);
//         votesResults.push({
//           votes: answerIdCounter,
//           voters: voters,
//           percent: formatedPercent
//         });
//       });
//       return votesResults;
//     }
  
//     vote(answerId, name = "Anonymouse") {
//       if (this.possibleAnswers[answerId]) {
//         let getCurrentDate = new Date().toLocaleString();
//         this.history.push({
//           id: answerId,
//           name: name,
//           date: getCurrentDate
//         });
//         return true;
//       } else throw new Error("Incorrect answer's id");
//     }
  
//   }
  
//   const q1 = new poll("Do you need a break ?", {
//     0: {
//       title: "Yes"
//     },
//     1: {
//       title: "No"
//     }
//   }); // Add some randome votes
  
//   for (let i = 0; i < 20; i++) {
//     q1.vote(Math.floor(Math.random() * (1 - 0 + 1)) + 0);
//   } // Poll interface script
  
  
//   let pollButtons = document.querySelectorAll('.poll-panel-btn'),
//       pollPanel = document.querySelector('.poll-panel');
//   pollButtons.forEach(button => {
//     button.onclick = () => {
//       if (button.getAttribute('disabled') != 'disabled') {
//         q1.vote(button.dataset.vote);
//         pollPanel.classList.add('poll-voted');
//         button.classList.add('--user-choice');
//         pollButtons.forEach(b => {
//           b.setAttribute('disabled', 'disabled');
//           let percent = q1.results[b.dataset.vote].percent + '%';
//           b.style.width = percent;
//           b.dataset.result = percent;
//         });
//       }
//     };
//   });

// ##################################################################################