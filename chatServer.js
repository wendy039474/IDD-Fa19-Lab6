/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var correctNum = 0; // keep count of correct answer, used for final result


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.
    socket.emit('changeBG', 'pink'); // changing the background color I prefer for my chatbot
    socket.emit('answer', "Hello! I am Chmath, a chatbot who is going to help you excercise your brain! +-×÷"); //We start with the introduction;
    setTimeout(timedQuestion, 6000, socket, "Before it starts, may I learn what your name is?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});

//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Here we go ' + input + ' !'; // output response
    waitTime = 3000;
    question = '5 + 8 =?'; // load next question
  } else if (questionNum == 1) {
    if (input === '13'){
      correctNum = correctNum +1;
      answer = 'You got it! :D'; // correct output response
    }
    else {
      answer = 'Sorry, wrong answer! :('; // wrong output response
    }
    waitTime = 3000;
    question = '23 - 14 =?'; // load next question
  } else if (questionNum == 2) {
    if (input === '9'){
      correctNum = correctNum +1;
      answer = 'Good job! :D'; // correct output response
    }
    else {
      answer = 'Wrong :( But you will get it next time!'; // wrong output response
    }
    waitTime = 3000;
    question = '7 × 11 =?'; // load next question
  } else if (questionNum == 3) {
    if (input === '77'){
      correctNum = correctNum +1;
      answer = 'You did it! :D'; // correct output response
    }
    else {
      answer = 'Ahh :( Next one will be better!'; // wrong output response
    }
    waitTime = 3000;
    question = '96 ÷ 6 =?'; // load next question
  } else if (questionNum == 4) {
    if (input === '16'){
      correctNum = correctNum +1;
      answer = 'Yay, that is correct! :D Let us try one more!'; // correct output response
    }
    else {
      answer = 'Wrong... Try harder for the coming last one!'; // wrong output response
    }
    waitTime = 3000;
    question = '105 ÷ 35 + 6 × 2 - 5 =?'; // load next question
  } else {
    if (input === '10'){
      correctNum = correctNum +1;
    }
    if (correctNum === 5){
      answer = 'You got all questions right, you nailed it! Until next time <3'; // output response for getting all right
    }
    else if (correctNum === 2 || correctNum === 3 || correctNum === 4){
      answer = 'You got ' + correctNum + '/5 questions right, I am proud of you! See you next time <3!'; // output
    }
    else if (correctNum === 1){
      answer = 'You only got ' + correctNum + ' question right...  You will do better next time <3'; // output response
    }
    else{
      answer = 'You did not get any question right... your brain might not be working? Go take some rest <3'; // output for all wrong
    }
    waitTime = 0;
    question = '';
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
