// npm install node-static && npm install ws
// http://bootstraptema.ru/stuff/snippets_bootstrap/form/gotovaja_forma_bootstrap_3/30-1-0-689

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);    // 1. Подключили библиотеку Soket.io к нашему веб-серверу
var id = Math.round(Math.random()*10000);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('Подключен к порту: 3000');
});

users = [];
io.on('connection', function(socket){              // 2. Установили событие "connection", которое будет сробатывать каждый раз, когда клиент будет устанавливать соединение с нашим веб-сокетом
  console.log('Подключился новый пользователь ' + id);
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

  socket.on('msg', function(data){                  // 6. Здесь же мы можем отловить это событие и для этого мы обращаемся к текущему объекту сокет, вызываем у него функцию 
      console.log(data);                            // "on" и отлавливаем событие "message". Дальше мы получаем даные, которые нам прислал пользователь в колбэк функции и отправляем это сообщение всем нашим клиентам, включая текущего.
      io.emit('newmsg', data);                      //Для этого мы обращаемся к объекту "io", вызываем у него метод "emit", т.е. создаем новое событие "new message" и передаем туда текст нашего сообщения.
  })

  socket.on('disconnect', function(){
          console.log('Пользователь ' + id + ' отключился');
      });
});

//веб-сокет