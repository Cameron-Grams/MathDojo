const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var passport = require('passport');  
var jwt = require('jsonwebtoken'); 

const { PORT, DATBASE_URL } = require( './config/mainConfig.js' );

//two data models exported models folder
const { Problem, Session } = require( './models/practiceSession' );
const { User } = require( './models/user' );

function generateTerm( min, max ){
  return Math.floor( Math.random() * ( max - min ) + min );
}

function generateCorrectResponse( num1, num2, operator ){
  switch( operator ){
      case "+":{
          return Number( num1 ) + Number( num2 );
      };
      case "-":{
          return Number( num1 ) - Number( num2 );
      }
      case "*":{
          return Number( num1 ) * Number( num2 );
      }
      case "/":{
          return Number( num1 ) / Number( num2 );
      }
      default: { 
          return; 
      }
  }
};

router.post( '/generate-session', jsonParser, ( req, res ) => {
    let problem;
    let practiceSession = [];  
    for ( let i = 0; i < req.body.number; i++ ){
        problem = Object.assign( {}, Problem );
        let firstTerm = generateTerm( req.body.min, req.body.max );
        let secondTerm = generateTerm( req.body.min, req.body.max );
        Object.assign( problem, {  //change to just object for pushing to session  
            operator: req.body.operation,
            firstTerm,
            secondTerm,
            problem: `${ firstTerm } ${ req.body.operation } ${ secondTerm }`,
            correctResponse: generateCorrectResponse( firstTerm, secondTerm, req.body.operation )
        } )
        practiceSession.push( problem );
    }
    
// save session into db 
    Session
    .create( {
        problems: practiceSession  
    } )
    .then(
        session => res.status( 201 ).json( session) )
    .catch( err => {
        console.error( err );
        res.status( 500 ).json( { message: 'Internal Server Error' } );
    });
} );

//route to register a user
router.post( '/register', function( req, res ) {  
    if( !req.body.name || !req.body.email || !req.body.password ) {
      res.json( { success: false, message: 'Please enter email and password.' } );
    } else {
      User.findOne( {
          email: req.body.email 
      }).then( function( foundUser ){ 
          if ( foundUser ){
              return res.json({ success: false, message: 'That email address already exists.'});
          } else {
              User.create( {
                name: req.body.name,   
                email: req.body.email,
                password: req.body.password
              } ).then( function( ){ 
                res.json( { success: true, message: 'Successfully created new user.' } );
              } ); 
            }
        })
    }
});

//Authentication if user exists
router.post( '/authenticate', function( req, res ) {  
    User.findOne({
      email: req.body.email
    }, function( err, user ) {
      if ( err ) throw err;
      if ( !user ) {
        res.send( { success: false, message: 'Authentication failed. User not found.' } );
      } else {
        // Check if password matches
        user.comparePassword( req.body.password, function( err, isMatch ) {
          if ( isMatch && !err ) {
            // Create token if the password matched and no error was thrown
            var token = jwt.sign( user, config.secret, {
            expiresIn: 10080 // in seconds, one week
            });
            res.json( { success: true, token: 'JWT ' + token } );
          } else {
            res.send( { success: false, message: 'Authentication failed. Passwords did not match.' } );
        }
      });
    }
  });
});

//protected route to the dashboard
router.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {  
    res.send('It worked! User id is: ' + req.user._id + '.');
  });




module.exports = router;