geddy = global.geddy;

console.log("hey you are loading game router.")
exports.gameAll = function( req, resp )
{
  LogDebug( "In Games.index" );

  var self = this;

  geddy.commonController.verifyGetUser( req,resp,
     function( user )
     {
        if( user )
        {
           Database.LoadGamesByUserId( user.id,
              function( gamesDB )
              {
                 if( gamesDB === null )
                    gamesDB = [];

                 resp.json( { games: gamesDB } );
              }
           );
        }
        else
           resp.json( { games: [] } );
     }
  );
};


 exports.add = function( req, resp )
 {
    var self = this;
    console.info( "in add" );
    function gotUserCallback( user )
    {
       resp.json( { user: user, params: req.body } );
    }

    geddy.commonController.verifyGetUser( req, resp, gotUserCallback )
 };

 exports.create = function( req, resp)
 {
    // todo error handling on user input
    var self = this;
    console.info( "in creategame " );
    function gotUserCallback( user )
    {
       if( !user )
       {
          LogError( "error authenticating user" )
          resp.redirect('/games/add?error=true');
       }

       // Save the resource, then display index page
       var word = geddy.wordlist.getWord();
       var game =
            {
               id: geddy.string.uuid( 10 ),
               drawFriend: user.id,
               drawName: user.name,
               //todo: verify that this is an actual friend of the user
               answerFriend: req.body.answerFriend,
               answerName: req.body.answerName,
               state: 0,
               word: word.word,
               difficulty: word.difficulty
            };
      // todo validate
//         if( game.isValid() )
//         {
          console.info( "saved game " + game.id )
          geddy.model.Game.save( game );
//         } else
//         {
//            LogError( "error creating game" )
//            LogError( game.isValid() )
//            resp.redirect( '/games/add?error=true' );
//         }
       resp.redirect( "/games/" + game.id + ".json" );
    }

    geddy.commonController.verifyGetUser( req, resp, gotUserCallback )
 };

 exports.show = function( req, resp)
 {
    var self = this;
    console.info( "getting game " + req.params.game );
    Database.LoadGameByGameId( req.params.game, function( game )
    {
       console.info( "got game " + game )
       resp.json( { game: game } );
    });
 };

 exports.update = function( req, resp)
 {
    // Save the resource, then display the item page
    console.info( "ID:" + req.params.game );
    console.info( "drawData:" + req.body.drawData );
    var self = this;
    geddy.model.Game.update( req.params.game, req.body.drawData, function( game )
    {
       //resp.redirect("/games/" + req.params.id);
       resp.json(game);
    });
 };

 exports.remove = function( req, resp)
 {
    resp.json( { params: req.body } );
 };

