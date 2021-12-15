var connected=false;
var socket=io("http://localhost:3000");
socket.emit("setup",userLoggedIn)