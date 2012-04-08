var QueryString = require("querystring")
	, url = require("url")
	, fbgraph = "https://graph.facebook.com";
var ajax = require(process.cwd() + '/util/ajax').Ajax;
var facebook = require(process.cwd() + '/util/facebook').Facebook;
var string = require(process.cwd() + '/util/string').String;
var controllerUtil = require(process.cwd() + '/util/controllerUtil').ControllerUtil;
geddy = global.geddy;
/*
 * GET home page.
 */
exports.index = function(req, res){
  var self = this;
  var result = {};
  console.log("req.cookies")
  console.log(req.cookies)
  var gotUserCallback = function (user) {
  	  var geddy = global.geddy;
      LogDebug( "In got user callback. user is " + user );
         result.user = user;
         if( user ){
            Database.LoadGamesByUserId( user.id,
               function( games )
               {
                  if( games === null )
                  {
                     LogError( "Failed to get games from: " + user.id );
                     games = [];
                  }

                  result.games = games;
                  done();
               } );
         }
         else{
            result.games = [];
            done();
         }
  };

  function done() {
     res.render(
			"index"
			,result
		);
  }

  controllerUtil.verifyGetUser(req, res, gotUserCallback);
  //geddy.commonController.verifyGetUser(this, gotUserCallback)


    //res.render('index', { title: 'Express' });
};


exports.connectToFacebook = function (req, resp, params) {
  var fbstate = req.session.fbstate;
  if (!fbstate) {
     fbstate = string.uuid(128);
     req.session.fbstate = fbstate;
  }
  console.log("in connectToFacebook, fbstate: "+ req.session.fbstate)
  var returnUrl = encodeURIComponent("http://" + global.config.FB.host + "/return");
  var appid = global.config.FB.appid;
  var secret = global.config.FB.secret;
  var redirecturl = facebook.getServerAuthUrl(appid, returnUrl, fbstate);
  resp.redirect(redirecturl);
};

function loginOrRegisterUser(token, expires, cb) {
	 // todo check for errors
      facebook.getMe( 
			token,
			function( data )
			{
			   if( data.error )
			   {
			      cb( data );
			   }
			   else
			   {
			      var me = data;
			      geddy.model.User.load( me.id, token, function( user )
			      {
			         if( !user )
			         {
			            // dont have this user yet, need to create a new one
			            // todo: replace expires with now + expires
			            user =  {
			               id: me.id,
			               name: me.name,
			               token: token,
			               expires: new Date()
			            };
			         }
			         else
			         {
			            user.token = token;
			            user.expires = new Date();
			         }

			         geddy.model.User.save( user );
			         cb( user );
			      } );
			   }
			}
		);
}

exports.returnFromFacebook = function (req, resp, params) {
      //todo: clean this crap up
      var self = this;
      var query = url.parse(req.url, true).query;
      console.log("return from fb" + req.url);
      console.log("query" + query);
      console.log("query.state" + query.state);
      var stateIsValid = false;
      var code;
      var fbstate = req.session.fbstate;
      console.log("fbstate" + fbstate)
      var done = function (data) {
         if (data && data.id) {
            resp.cookie("fbid", data.id, { path: "/" });
            resp.redirect('/');
         } else {
            LogError("error in returnFromFacebook, data:" + data);
            resp.render('return',data);
         }
      }
      var errorhandler = function () {
         var errormsg = "oh snap, got an error in returnFromFacebook";
         LogError(errormsg);
         done({ error: "oh snap, got an error in returnFromFacebook" });
      }


      if (query.state && fbstate === query.state) {
         stateIsValid = true;
      }

      code = query.code

      if (stateIsValid && code) {
         function gotTokenCallback(data) {
            if (data) {
               var qs = QueryString.parse(data);
               var token = qs.access_token;
               var now = new Date();
               var expires = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() + parseInt(qs.expires, 10), now.getMilliseconds());
               resp.cookie("fbauth", token, { "expires": expires, path: "/" });
               loginOrRegisterUser(token, qs.expires, done);
            }
            else {
               errorhandler()
            }
         }

         facebook.getServerAccessTokenUrl("/return", code, gotTokenCallback);
      }
      else {
         var errormsg = "error: state is invalid or can't get code from callback";
         LogError(errormsg);
         LogError(query);
         done({ error: errormsg });
      }
   };

exports.wipe = function( req, resp )
   {
      // HOLY CRAP WIPES THE DB
      if( req.method === 'POST' )
      {
         geddy.db.DropDatabase();
         geddy.log.info( "wiping db" )
      }

      geddy.log.info( "wipe" )
      resp.render( "wipe", {});
   };
