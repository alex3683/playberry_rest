

exports.init = init;
exports.createLink = createLink;


var _app;

function init( app ) {
   _app = app;
}


function createLink( req, relativeLink ) {
   var link = req.protocol + '://' + req.host + ':' + _app.get( 'port' );
   if( relativeLink.indexOf( '/' ) !== 0 ) {
      link += '/';
   }
   link += relativeLink;
   return link;
}