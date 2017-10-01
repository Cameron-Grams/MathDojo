const express = require( 'express' );
const morgan = require( 'morgan' );

const app = express();

//routing info? 

app.use( morgan( 'dev' ) );

app.use( express.static( 'public' ) );

app.get( '/', ( req, res ) => {
  res.sendFile( __dirname + '/views/login.html' );
} );



let server;

function runServer(){
  const port = process.env.PORT || 8080;
  return new Promise( ( resolve, reject ) => {
    server = app.listen( port, () => {
      console.log( `Listening on ${ port }` );
      resolve( server );
    } ).on( 'error' , err => {
      reject( err )
    } );
  } );
}

function closerServer(){
  return new Promise( ( resolve, reject ) => {
    console.log( 'Closing Server' );
    server.close( err => {
      if ( err ){
        reject( err );
        return;
      }
      resolve();
    } );
  } )
}

if ( require.main === module ){
  runServer().catch( err => console.error( err ) );
};

