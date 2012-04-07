var MongoDb = new (function()
{
   // "Constructor"
   this.Db;
   var gamesCollectionName = "games";
   var usersCollectionName = "users";
   EnsureConnection(function () { });

   // Public interface

   // TODO ryknuth: delete this function when DB is settled
   this.DropDatabase = function ()
   {
      geddy.log.debug("Dropping database.");
      EnsureConnection(
         function() {
            this.Db.dropDatabase(
               function( err, result ) {
                  if( err )
                     geddy.log.debug("Failed to drop database");

                  // Close the DB and reopen. This will create a brand new one.
                  CloseConnection();
                  EnsureConnection( function() {} );
               }
            );
         }
      );
   }

   this.SaveGame = function( game )
   {
      Save( game, gamesCollectionName );
   }
   
   this.SaveUser = function( user )
   {
      Save( user, usersCollectionName );
   }

   this.LoadGamesByUserId = function( userid, callback )
   {
      geddy.log.debug( "Loading games from user: " + userid );
      EnsureConnection(
         function()
         {
            EnsureCollection( gamesCollectionName,
               function( collection )
               {
                  if( collection )
                  {
                     collection.find( { $or : [ { "drawFriend" : userid }, { "answerFriend" : userid } ] } ).toArray(
                        function( err, games )
                        {
                           if( err )
                           {
                              geddy.log.error( "Unabled to load games from user: " + userid );
                              games = null;
                           }
                           else
                              geddy.log.debug( "Loaded games for user: " + userid );

                           callback.call( this, games );
                        }
                     );
                  }
               }
            );
         }
      );
   }

   this.LoadUser = function( id, token, callback )
   {
      geddy.log.debug( "Loading user from fbtoken: " + token );
      EnsureConnection(
         function()
         {
            EnsureCollection( usersCollectionName,
               function( collection )
               {
                  if( collection )
                  {
                     collection.findOne( { $and : [ { "id" : id }, { "token" : token } ] }, 
                        function( err, user )
                        {
                           if( err )
                           {
                              geddy.log.error( "Unabled to load user from token: " + token );
                              user = null;
                           }
                           else
                              geddy.log.debug( "Loaded user for token: " + token );

                           callback.call( this, user );
                        }
                     );
                  }
               }
            );
         }
      );
   }

   // Internal functions
   function EnsureConnection( callback )
   {
      if( this.Db )
      {
         geddy.log.debug( "Found persist db connection." );
         callback.call( this );
         return;
      }

      geddy.log.debug( "Ensuring db connection." );

      var internalDb = require('mongodb').Db;
      var Server = require('mongodb').Server;

      if(process.env.MONGOHQ_URL === undefined)
      {
         url = "mongodb://localhost:27017/GeddyGame";
      }
      else
      {
         url = process.env.MONGOHQ_URL;
      }
      internalDb.connect( url,
         function( err, db )
         {
            if( err )
               geddy.log.error( "Error opening MongoDB " + err );
            else
            {
               this.Db = db;
               geddy.log.debug( "Opened MongoDB connection." );
               callback.call( this );
            }
         }
      );
   }

   function EnsureCollection( collectionName, callback )
   {
      if( this.Db )
         Db.collection( collectionName,
            function( err, collection )
            {
               if( err )
                  geddy.log.error( "Unabled to find: " + collectionName );
               else
               {
                  geddy.log.debug( "Got collection: " + collectionName );
                  callback.call( this, collection );
               }
            }
         );
   }
   
   function Save( data, collectionName )
   {
      geddy.log.debug( "Saving data: " + JSON.stringify( data ) + " to collection: " + collectionName );
      EnsureConnection(
         function()
         {
            EnsureCollection( collectionName,
               function( collection )
               {
                  // Finally... save the data
                  if( collection )
                  {
                     collection.insert( data,
                        function( err, result )
                        {
                           if( err )
                              geddy.log.error( "Unabled to write to: " + collectionName );
                           else
                              geddy.log.debug( "Wrote: " + JSON.stringify( data ) );
                        }
                    );
                  }
               }
            );
         }
      );
   }

   function CloseConnection()
   {
      if( this.Db )
         this.Db.close();
      this.Db = null;
   }
} )

exports.MongoDb = MongoDb;
