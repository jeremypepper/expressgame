var geddy = global.geddy;
var MongoDb = new ( function()
{
   // "Constructor"
   this.Db;
   var gamesCollectionName = "games";
   var usersCollectionName = "users";

   // Setting up the initial db, let's ensure we have the indices right too
   EnsureConnection( 
      function()
      {
         EnsureIndexOnCollection( gamesCollectionName );
         EnsureIndexOnCollection( usersCollectionName );
      }
   );

   // Public interface

   // TODO ryknuth: delete this function when DB is settled
   this.DropDatabase = function()
   {
      console.info( "Dropping database." );
      EnsureConnection( 
         function()
         {
            this.Db.dropDatabase( 
               function( err, result )
               {
                  if( err )
                     console.info( "Failed to drop database" );

                  // Close the DB and reopen. This will create a brand new one.
                  CloseConnection();
                  EnsureConnection( function() { } );
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
      console.info( "Loading games from user: " + userid );
      Load( gamesCollectionName,
         function( collection )
         {
            if( collection )
            {
               collection.find( { $or: [{ "drawFriend": userid }, { "answerFriend": userid}] } ).toArray( 
                  function( err, games )
                  {
                     if( err )
                     {
                        console.error( "Unabled to load games from user: " + userid );
                        games = [];
                     }
                     else
                        console.info( "Loaded games for user: " + userid );

                     callback.call( this, games );
                  }
               );
            }
            else
               callback.call( this, [] );
         }
      );
   }

   this.LoadGameByGameId = function( gameid, callback )
   {
      console.info( "Loading game from gameid: " + gameid );
      Load( gamesCollectionName,
         function( collection )
         {
            if( collection )
            {
               collection.findOne( { "id": gameid },
                  function( err, game )
                  {
                     if( err )
                     {
                        console.error( "Unabled to load game from gameid: " + gameid );
                        game = null;
                     }
                     else
                        console.info( "Loaded game for gameid: " + gameid );

                     callback.call( this, game );
                  }
               );
            }
            else
               callback.call( this, null );
         }
      );
   }

   this.LoadUser = function( id, token, callback )
   {
      console.info( "Loading user from fbtoken: " + token );
      Load( usersCollectionName,
         function( collection )
         {
            if( collection )
            {
               var query = { $and: [{ "id": id }, { "token": token}] };
               if( token === null )
                  query = { "id": id };
               collection.findOne( query,
                  function( err, user )
                  {
                     if( err )
                     {
                        console.error( "Unabled to load user from token: " + token );
                        user = null;
                     }
                     else
                        console.info( "Loaded user for token: " + token );

                     callback.call( this, user );
                  }
               );
            }
            else
               callback.call( this, null );
         }
      );
   }

   this.LoadAllUsers = function( callback )
   {
      console.info( "Loading all users." );
      Load( usersCollectionName,
         function( collection )
         {
            if( collection )
            {
               collection.find().toArray( 
                  function( err, users )
                  {
                     if( err )
                     {
                        console.error( "Failed to get all users." );
                        users = [];
                     }

                     callback.call( this, users );
                  }
               );
            }
            else
               callback.call( this, [] );
         }
      );
   }

   // Internal functions
   function EnsureConnection( callback )
   {
      if( this.Db )
      {
         console.info( "Found persist db connection." );
         callback.call( this );
         return;
      }

      console.info( "Ensuring db connection." );

      var internalDb = require( 'mongodb' ).Db;
      var Server = require( 'mongodb' ).Server;

      if( process.env.MONGOHQ_URL === undefined )
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
               console.error( "Error opening MongoDB " + err );
            else
            {
               this.Db = db;
               console.info( "Opened MongoDB connection." );
            }

            callback.call( this );
         }
      );
   }

   function EnsureCollection( collectionName, callback )
   {
      if( this.Db )
      {
         Db.collection( collectionName,
            function( err, collection )
            {
               if( err )
               {
                  console.error( "Unabled to find: " + collectionName );
                  collection = null;
               }
               else
                  console.info( "Got collection: " + collectionName );

               callback.call( this, collection );
            }
         );
      }
      else
         callback.call( this, null );
   }

   function Save( data, collectionName )
   {
      // TODO ryknuth: if this fails.. should we let the controller know?
      console.info( "Saving data: " + JSON.stringify( data ) + " to collection: " + collectionName );
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
                              console.error( "Unabled to write to: " + collectionName );
                           else
                              console.info( "Wrote: " + JSON.stringify( data ) );
                        }
                    );
                  }
               }
            );
         }
      );
   }

   function Load( collectionName, queryCallback )
   {
      EnsureConnection( 
         function()
         {
            EnsureCollection( collectionName,
               function( collection )
               {
                  if( collection === null )
                     console.error( "Unable to find collection: " + collectionName );
                  queryCallback.call( this, collection );
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

   function EnsureIndexOnCollection( collectionName )
   {
      EnsureCollection( collectionName,
         function( collection )
         {
            if( collection )
            {
               collection.ensureIndex( { id: 1 }, { unique: true, background: true },
                  function( error, indexName )
                  {
                     if( error )
                        console.error( "Unable to ensureIndex on: " + collectionName + " error: " + error );
                     else
                        console.info( "Ensured index on: " + collectionName );
                  }
               );
            }
         }
      );
   }
} )

exports.MongoDb = MongoDb;
