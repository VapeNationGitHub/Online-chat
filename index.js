// npm install node-static && npm install ws
// http://bootstraptema.ru/stuff/snippets_bootstrap/form/gotovaja_forma_bootstrap_3/30-1-0-689

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);   



app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('Подключен к порту: 3000');
});

users = [];
io.on('connection', function(socket){             
  console.log('Подключился новый пользователь ')
  socket.on('setUsername', function(data){
    console.log(data);
    if(users.indexOf(data) > -1){
      socket.emit('userExists', data + ' это имя пользователя уже занято. Пожалуйста. введите другое имя!');
    }
    else{
      users.push(data);
      socket.emit('userSet', {username: data});
    }
  });

  socket.on('msg', function(data){                  
      console.log(data);                            
      io.emit('newmsg', data);                      
  })

  socket.on('disconnect', function(){
          console.log('Пользователь отключился'); 
      });
});

//веб-сокет