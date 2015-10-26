/**
 * Created by Nick on 10/20/15.
 */

module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log(socket.request.user.username,'connected');
        io.emit('conn',socket.request.user.username);

        socket.on('chat', function (msg) {
            //console.log('message:',msg);
            io.emit('chat',{user:socket.request.user.username,msg:msg});
        });

        socket.on('disconnect',function(){
            console.log(socket.request.user.username,'disconnected');
            io.emit('dc',socket.request.user.username);
        });
        socket.on('advance', function () {
            console.log('advancing clients');
            io.emit('advance');
        });
        socket.on('test', function (foo) {
            console.log(foo);
            console.log('test');
        });
    });
};