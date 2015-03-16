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

io.sockets.on('connection', function (socket) {

  socket.emit('connected', {'socket_id': socket.id});

});
