// Use these as static functions! Models grabbed from the DB do not have these functions
var User = new ( function()
{
   geddy = global.geddy;
   this.save = function( user )
   {
      user.saved = true;
      geddy.db.SaveUser( user );
   };
   this.load = function( id, token, callback )
   {
      geddy.db.LoadUser( id, token, callback );
   };
   this.loadAll = function( callback )
   {
      geddy.db.LoadAllUsers( callback );
   };
} )();
exports.User = User;