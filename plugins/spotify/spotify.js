var q = require( 'q' );
var Spotify = require( 'spotify-web' );
var searchParser = require( './search.js' );

exports.connect = connect;
exports.disconnect = disconnect;
exports.search = search;


var _spotify;


function connect( config ) {
   var deferred = q.defer();

   var username = new Buffer( config.username, 'base64' ).toString( 'ascii' );
   var password = new Buffer( config.password, 'base64' ).toString( 'ascii' );
   Spotify.login( username, password, function( err, spotify ) {
      if( err ) {
         return deferred.reject( err );
      }

      _spotify = spotify;

      deferred.resolve();
   } );

   return deferred.promise;
}


function disconnect() {
   _spotify.disconnect();
}


function search( searchJob ) {
   var deferred = q.defer();

   console.log( searchJob );

   _spotify.search( searchJob, function( err, xml ) {
      if( err ) {
         return deferred.reject( err );
      }

      searchParser.parse( xml )
         .then( deferred.resolve );
   } );

   return deferred.promise;
}