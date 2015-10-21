/**
 * Created by Nick on 10/20/15.
 */

module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('a user connected');
        //console.log(socket.client.conn);
        console.log(socket.request.user);
        socket.on('chat', function (msg) {
            console.log('message:',msg);
            io.emit('chat',{user:socket.request.user.username,msg:msg});
        });

    });
};