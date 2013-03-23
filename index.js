var express = require( 'express' );
var linkCreator = require( './lib/link_creator.js' );
var spotifyPlugin = require( './plugins/spotify/spotify.js' );

var app = express();

var allowCrossDomain = function(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
   res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');

   next();
};

app.use( allowCrossDomain );
app.use( express.bodyParser() );
app.set( 'port', 8666 );

linkCreator.init( app );

app.options( '*', function( req, res ) { res.send(); } );

spotifyPlugin.connect( require( './spotify_login.js' ) );

app.get( '/', function( req, res ) {
   res.send( {
      links: {
         search: linkCreator.createLink( req, '/search' ),
         self: linkCreator.createLink( req, '' )
      }
   } );
} );

app.post( '/search', function( req, res ) {
   spotifyPlugin.search( req.body )
      .then( function( result ) {
         res.json( result );
      } );
} );

app.listen( app.get( 'port' ) );