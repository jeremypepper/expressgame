geddy = global.geddy;

console.log("hey you are loading game router.")
exports.gameAll = function( req, resp )
{
  geddy.log.debug( "In Games.index" );

  var self = this;

  geddy.commonController.verifyGetUser( req,resp,
     function( user )
     {
        if( user )
        {
           geddy.db.LoadGamesByUserId( user.id,
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
    geddy.log.info( "in add" );
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
    geddy.log.info( "in creategame " );
    function gotUserCallback( user )
    {
       if( !user )
       {
          geddy.log.error( "error authenticating user" )
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
          geddy.log.info( "saved game " + game.id )
          geddy.model.Game.save( game );
//         } else
//         {
//            geddy.log.error( "error creating game" )
//            geddy.log.error( game.isValid() )
//            resp.redirect( '/games/add?error=true' );
//         }
       resp.redirect( "/games/" + game.id + ".json" );
    }

    geddy.commonController.verifyGetUser( req, resp, gotUserCallback )
 };

 exports.show = function( req, resp)
 {
    var self = this;
    geddy.log.info( "getting game " + req.params.game );
    geddy.db.LoadGameByGameId( req.params.game, function( game )
    {
       geddy.log.info( "got game " + game )
       resp.json( { game: game } );
    });
 };

 exports.update = function( req, resp)
 {
    // Save the resource, then display the item page
    geddy.log.info( "ID:" + req.params.game );
    geddy.log.info( "drawData:" + req.body.drawData );
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

