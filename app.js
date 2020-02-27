// module dependencies
var express = require('express')
	
  , cookieParser = require('cookie-parser')
  , favicon = require('serve-favicon')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')

  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io')

  , routes = require('./routes')
  , api = require('./routes/api');

// app variables
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(morgan('dev'));
app.use(cookieParser());
//app.use(bodyParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

//app.use(methodOverride());
//app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
// if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:deviceType/:view', routes.partials);

// REST API
app.get('/api/user', api.getUser);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io communication
io.sockets.on('connection', require('./routes/socket'));

// HTTP server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
