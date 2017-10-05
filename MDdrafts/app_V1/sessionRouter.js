const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { PORT, DATBASE_URL } = require( './config/mainConfig.js' );

//two data models exported from the practiceSession.js 
const { Problem, Session } = require( './models/practiceSession' );



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
    if( !req.body.email || !req.body.password ) {
      res.json( { success: false, message: 'Please enter email and password.' } );
    } else {
      var newUser = new User( {
        email: req.body.email,
        password: req.body.password
      } );
  
      // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.json({ success: true, message: 'Successfully created new user.' });
    });
  }
});








module.exports = router;