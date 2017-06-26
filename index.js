// npm install node-static && npm install ws
// http://bootstraptema.ru/stuff/snippets_bootstrap/form/gotovaja_forma_bootstrap_3/30-1-0-689

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);    // 1. Подключили библиотеку Soket.io к нашему веб-серверу


var clients = {};
var nameID = Math.round(Math.random()*10000);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('Подключен к порту: 3000');
});


users = [];
io.on('connection', function(socket){              // 2. Установили событие "connection", которое будет сробатывать каждый раз, когда клиент будет устанавливать соединение с нашим веб-сокетом
  console.log('Подключился новый пользователь ' + nameID);
  socket.on('setUsername', function(data){
    console.log(data);
    if(users.indexOf(data) > -1){
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }
    else{
      users.push(data);
      socket.emit('userSet', {username: data});
    }
  });

  socket.on('disconnect', function(){
          console.log('Пользователь ' + nameID + ' отключился');
      });


  socket.on('msg', function(data){
      io.sockets.emit('newmsg', data);
  })
});

   
/*    
io.on('connection', function(socket){   // 2. Установили событие "connection", которое будет сробатывать каждый раз, когда клиент будет устанавливать соединение с нашим веб-сокетом
    console.log('Подключился новый пользователь ');// + nameID);

    socket.on('message', function(data){                     // 6. Здесь же мы можем отловить это событие и для этого мы обращаемся к текущему объекту сокет, вызываем у него функцию                                       
        console.log(data);                                   // "on" и отлавливаем событие "message". Дальше мы получаем даные, которые нам прислал пользователь в колбэк функции и отправляем это сообщение всем нашим клиентам, включая текущего.
        io.emit('new message', data);                        //Для этого мы обращаемся к объекту "io", вызываем у него метод "emit", т.е. создаем новое событие "new message" и передаем туда текст нашего сообщения.
      });

      socket.on('disconnect', function(){
          console.log('Пользователь ' + nameID + ' отключился');
      });
});
*/
//веб-сокет