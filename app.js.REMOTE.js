
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , gamecontroller = require('./routes/game')

var app = module.exports = express.createServer();
require("express-resource")
// Configuration

const fbId = "405186406159531";
const fbSecret = "693ab1df0adcfe0975b9896e751279d7";
const fbCallbackAddress= "http://localhost:4000/auth/facebook";
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.cookieParser('my secret here, holy crap this should be a better secret'));
  app.use(express.session({secret: 'my secret here, holy crap this should be a better secret'}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
});

// public config
global.config = {};
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  //app.set("fbhost","localhost");
  global.config.FB = 
  {
     host : "localhost"
    , appid : 405186406159531
    , secret : "693ab1df0adcfe0975b9896e751279d7"
  };
});

app.configure('production', function(){
  app.use(express.errorHandler());
  app.set("fbhost","notp.herokuapp.com");;
});

app.get('/', routes.index);
app.get('/connectToFacebook', routes.connectToFacebook);
app.get('/return', routes.returnFromFacebook);
app.resource('games', require('./routes/game'), 
  {
    index:gamecontroller.gameAll,
    load: gamecontroller.load, 
    show: gamecontroller.show,
    create:gamecontroller.create,
    update:gamecontroller.update
   });

// Todo ryknuth: make these write different colors
console.error = console.log;
LogInfo = console.log;
LogWarning = console.log;
console.info = console.log;
Database = require(process.cwd() + '/util/mongodb').MongoDb;

// Routes
// app.get('/', routes.index);
// app.get('/connectToFacebook', routes.connectToFacebook);
// app.get('/return', routes.returnFromFacebook);
// app.get('/games.:format', gamecontroller.gameAll);
// app.post('/games.:format?', gamecontroller.create);
// app.get('/games/:id.:format?', gamecontroller.show);
// app.put('/games/:id.:format?', gamecontroller.update);
//geddy crap to remove in the future
geddy = {};
geddy.log = {};
global.geddy = geddy;
geddy.model = {}
geddy.model = {};
geddy.model.Game = require(process.cwd() + '/model_adapters/game').Game;
geddy.model.User = require(process.cwd() + '/model_adapters/user').User;
geddy.commonController = require(process.cwd() + '/util/controllerUtil').ControllerUtil;
var words = require(process.cwd() + '/util/words').Words;
geddy.wordlist = require(process.cwd() + '/util/wordlist').WordList(words);
geddy.string =  require(process.cwd() + '/util/string').String;
app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
