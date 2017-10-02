const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//the model of the data to be generated and returned as the session object
//think this is the problem....
const { session } = require('./models/practiceSession' );


function generateTerm( min, max ){
  return Math.floor( Math.random() * ( max - min ) + min );
}

function generateResult( num1, num2, operator ){
  switch( operator ){
      case "+":{
          return Number( num1 ) + Number( num2 );
      }
    

      default: { 
          return; 
      }
  }

}

router.post( '/generate-session', jsonParser, ( req, res ) => {

    let session = [];  
    for ( let i = 0; i < req.body.number; i++ ){
        let firstTerm = generateTerm( req.body.min, req.body.max );
        let secondTerm = generateTerm( req.body.min, req.body.max );
        session.push( { 
            operator: req.body.operation,
            firstTerm,
            secondTerm,
            problem: `${ firstTerm } ${ req.body.operation } ${ secondTerm }`,
            correctResponse: generateResult( firstTerm, secondTerm, req.body.operation )
        } );
    }

// save session into db 
    


//    const item = session.create( req.body.operation, req.body.number, req.body.min, req.body.max );
   res.status( 201 ).json( session );
})






module.exports = router;