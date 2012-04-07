
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , auth = require('connect-auth')

var app = module.exports = express.createServer();

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

// Routes
app.get('/', routes.index);
app.get('/connectToFacebook', routes.connectToFacebook);
app.get('/return', routes.returnFromFacebook);


//geddy crap to remove in the future
geddy = {};
geddy.log = {};
geddy.log.error = console.log;
geddy.log.info = console.log;
geddy.log.warn = console.log;
global.geddy = geddy;

app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
