// Use these as static functions! Models grabbed from the DB do not have these functions
geddy = global.geddy;
var Game = new ( function()
{
   this.fisgame = true;

   this.save = function( game )
   {
      game.saved = true;
      geddy.db.SaveGame( game );
   }

   this.update = function( id, drawData, callback )
   {
      geddy.db.LoadGameByGameId( id, function( game )
      {
         if( game )
         {
            game.drawData = drawData;
            geddy.model.Game.save( game );
         }

         callback( game );
      } );
   }

   this.loadByGameId = function( gameid, callback )
   {
      geddy.db.LoadGameByGameId( gameid, callback );
   }

   this.loadByUserId = function( userid, callback )
   {
      geddy.db.LoadGamesByUserId( userid, callback );
   }

   geddy.log.debug( "creating the game model adapter" );
} )();

Game.getOtherUserId = function(game, myUserId){
  if(game.drawFriend != myUserId){
    return game.drawFriend;
  }
  else{
    return game.answerFriend;
  }
};

Game.getOtherUserName = function(game, myUserId){
  if(game.drawFriend != myUserId){
    return game.drawName;
  }
  else{
    return game.answerName;
  }
};

exports.Game = Game;