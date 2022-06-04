const express = require('express'); //Line 1
const app = express(); //Line 2
const socket=require('socket.io')

const server=app.listen(4000,function(){
  console.log("listening to port 4000")
})

var io=socket(server);
io.on('connection',function(socket){
  console.log("new client connected")
  socket.on('message',(msg)=>{
    socket.broadcast.emit('message',msg)
})
})
// app.use(express.static('./client/public'))