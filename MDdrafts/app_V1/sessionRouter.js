const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { PORT, DATBASE_URL } = require( './.config' );

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
        Object.assign( problem, { 
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
} )

module.exports = router;