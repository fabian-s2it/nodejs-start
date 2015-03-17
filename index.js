var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app);

var env = process.env.NODE_ENV || 'development';

if ('development' == env) {

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));
}

app.use(express.static(path.join(__dirname, 'core')));
app.use(express.static(path.join(__dirname, 'templates/images')));
app.use(express.static(path.join(__dirname, 'templates/css')));
app.use(express.static(path.join(__dirname, 'templates/js')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/index.html');
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require("socket.io").listen(server);
var PessoaModule = require('./core/pessoa.js');

var pessoas = [];

io.sockets.on('connection', function (socket) {

  socket.pessoa = new PessoaModule();

  socket.emit('connected', {'socket_id': socket.id});

  socket.on('new pessoa', function (data) {
    socket.pessoa.nome = data.nome;
    pessoas.push(socket.pessoa);
    io.sockets.emit('update pessoas', pessoas);
  });

  socket.on('botao click', function (data) {
    io.sockets.emit('event botao click', {'pessoa': data.pessoa, 'botao': data.botao})
  });


  socket.on('disconnect', function (data){
    for (var i = 0; i < pessoas.length; i++) {
      if (socket.pessoa.nome == pessoas[i].nome) {
        pessoas.splice(i, 1);
      }
    }

    io.sockets.emit('update pessoas', pessoas);

  });

});
