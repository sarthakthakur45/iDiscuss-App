// ws is used when we use web socket 
const socket = io('ws://localhost:8000', {transports: ['websocket', 'polling', 'flashsocket']});

// Get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// function which will append to the container
const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

// If the form gets submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    // Empty the textbox
    messageInput.value = '';
})

// Ask new user for his/her name and let the server know
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

// If a new user joins, receives his/her name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

// If server sends a message receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

// If  user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'right')
})