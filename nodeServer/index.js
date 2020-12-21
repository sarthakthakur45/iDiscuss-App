//Node server which will handle socket io connections
const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket => {
    // If any new user join let other users connected to server know
    socket.on('new-user-joined', name => {
        console.log('New user', name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know
    // disconnect is a built in event
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

})