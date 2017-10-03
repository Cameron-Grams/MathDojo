const express = require( 'express' );
const morgan = require( 'morgan' );

const mongoose = require( 'mongoose' );
mongoose.Promise = global.Promise; 

const app = express();
const { PORT, DATABASE_URL } = require( './.config' );
const sessionRouter = require( './sessionRouter' );
 
app.use( morgan( 'dev' ) );

app.use( express.static( 'public' ) );

app.use( '/api', sessionRouter );

let server;
 
function runServer(databaseUrl = DATABASE_URL, port = PORT ){
    return new Promise( ( resolve, reject ) => {
        mongoose.connect( databaseUrl, err => {
          if ( err ){
            return reject( err );
          }
          server = app.listen( port, () => {
            console.log( `Listening on port ${ port }`);
            resolve();
          })
          .on( 'error', err => {
            mongoose.disconnect();
            reject( err );
          } )
        } )
    } );
};

function closeServer(){
  return mongoose.disconnect().then( () => {    
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
  } )
};

if ( require.main === module ){
  runServer().catch( err => console.error( err ) );
};

module.exports = { app, runServer, closeServer };