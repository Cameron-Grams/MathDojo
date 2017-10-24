const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var passport = require('passport');  
var jwt = require('jsonwebtoken'); 
 
const { secret, PORT, DATBASE_URL } = require( './config/mainConfig.js' );

//two data models exported models folder
const { Session } = require( './models/practiceSession' );
const { User } = require( './models/user' );

//helper function to manage the terms in the equations
function generateTerm( min, max ){
    console.log( typeof min, typeof max);
    const minNum = Number(min);
    const maxNum = Number(max); 
  return Math.floor( (Math.random() * ( maxNum - minNum + 1)) + minNum );
}
//helper function to move from string values of operators to the numeric response values
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
 

router.route("/session")
    .post(passport.authenticate('jwt', { session: false }), jsonParser, ( req, res ) => {
        let practiceSession = [];  
        for ( let i = 0; i < req.body.number; i++ ){
            let firstTerm = generateTerm( req.body.min, req.body.max );
            let secondTerm = generateTerm( req.body.min, req.body.max );
            const problem = {  
                operator: req.body.operation,
                firstTerm,
                secondTerm,
                problem: `${ firstTerm } ${ req.body.operation } ${ secondTerm }`,
                correctResponse: generateCorrectResponse( firstTerm, secondTerm, req.body.operation )
            }; 
            practiceSession.push( problem );
        }
        
    // save session into db sessions collection for use in the training-logic.js
        Session
        .create( {
            userId: req.user._id, 
            problems: practiceSession  
        } )
        .then(
            session => res.status( 201 ).json( session) )
        .catch( err => {
            console.error( err );
            res.status( 500 ).json( { message: 'Internal Server Error' } );
        });
    } );
    
router.route( '/session/:sessionId')
    .get(passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
        Session.find( { _id: req.params.sessionId } )
        .then( ( session ) => {
            res.json( session );
        } )
        .catch( () => res.status( 500 ).send( 'problem sending the session' ) );
    })
    .delete(passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
        console.log('in deletion with: ', req.params.sessionId);
        Session.findByIdAndRemove(mongoose.Types.ObjectId(req.params.sessionId))
            .then(() => res.status(204).json({status: "successfully deleted session", message:"sweet"}))
            .catch((err) => res.json({ status:"error with session deletion", message: err.message}));
    })
    .patch(passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
        if (req.body.action === 'problem'){
            Session.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.sessionId), {$set : {[`problems.${req.body.index}.userResponse`]: req.body.userResponse } }, { new: true } )
            .then((updated)=>{
            res.json(updated.problems[req.body.index]);
            })
            .catch((err) => {
            res.json({status: "error" , message:err.message});
            });
        } else if ( req.body.action === 'accuracy'){
            Session.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.sessionId), 
            {$set: {
                "ratioCorrect": req.body.ratioCorrect,
                "pointsAwarded": req.body.pointsAwarded
            }},
            {new: true})
            .then( (updated) => {
                res.json({status: "successful session update", message:"sweet"})
            })
            .catch((err) => {
                res.json({ status:"error with session update", message: err.message})
            });


        } else {
            res.status(400).send("bad request");
        }
    });
 
module.exports = router;


