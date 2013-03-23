var xml2js = require( 'xml2js' );
var q = require( 'q' );
var _ = require( 'lodash' );


exports.parse = parse;


function parse( xml ) {
   var deferred = q.defer();

   xml2js.parseString( xml, function( err, parsed ) {
      if( err ) {
         return deferred.reject( err );
      }

      console.log( JSON.stringify( parsed.result ) );

      var result = {
         artists: [],
         albums: [],
         tracks: []
      };

      _.each( [ 'artist', 'album', 'track' ], function( item ) {
         var items = item + 's';
         if( parsed.result[items] && parsed.result[items][0] && parsed.result[items][0][item] ) {
            _.each( parsed.result[items][0][item], function( entry ) {
               result[items].push( flatten( entry ) );
            } );
         }
      } );

      deferred.resolve( result );
   } );


   return deferred.promise;
}


function flatten( obj ) {
   if( _.isArray( obj )  ) {
      if( obj.length === 1 && !_.isArray( obj[0] ) ) {
         return flatten( obj[0] );
      }
      return _.map( obj, function( value ) {
         return flatten( value );
      } );
   }

   if( _.isObject( obj ) ) {
      var result = {};
      _.each( obj, function( value, key ) {
         result[ key ] = flatten( value );
      } );
      return result;
   }

   return obj;
}