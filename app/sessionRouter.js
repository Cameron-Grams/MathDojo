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

function generateTerm( min, max ){
    console.log( typeof min, typeof max);
    const minNum = Number(min);
    const maxNum = Number(max); 
  return Math.floor( (Math.random() * ( maxNum - minNum + 1)) + minNum );
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
 
router.post( '/generate-session', passport.authenticate('jwt', { session: false }), jsonParser, ( req, res ) => {
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
    
// save session into db 
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

//route to register a user
router.post( '/register', function( req, res ) {  
    if( !req.body.name || !req.body.email || !req.body.password ) {
      return res.status(400).json( { success: false, message: 'Please complete the entire form.' } );
    } else {
      User.findOne( {
          email: req.body.email 
      }).then( function( foundUser ){ 
          if ( foundUser ){
              return res.status(400).json({ success: false, message: 'That email address already exists.'});
          } else {
              User.create( {
                name: req.body.name,   
                email: req.body.email,
                password: req.body.password,
                level: 0
              } ).then( function( ){ 
                    let newUser = User.findOne( {
                        email: req.body.email
                    }).then( returnNewUser => {
                        res.json( returnNewUser );
                    } );
                } )
            } 
        })
    }
});
  
//Authentication if user exists
router.post( '/authenticate', function( req, res ) {  
    User.findOne({
      "email" : req.body.email
    } ).then
    ( ( user ) => {
        if ( !user ){
            res.status( 400 ).send( { success: false, message: 'Authentication failed. User not found.' } );
        } else {
            user.comparePassword( req.body.password, function( err, isMatch ) {
                if ( isMatch && !err ){
                    console.log( 'good authentication' );
                    var token = jwt.sign( { id: user._id, userName: user.name, level: user.level }, secret, {
                        expiresIn: 10080
                    } );
                    res.json( { success: true, token: 'Bearer ' + token, _id: user._id } );
                } else {
                    res.status( 400 ).send( { success: false, message: 'Authentication failed. User not found.' } );
                }
            })
        }
    } ).catch( err => res.send( err ) );
});






router.get('/getUserInfo/:userId', passport.authenticate('jwt', { session: false }), function(req, res) {  
    User.find( { _id: req.params.userId } )
    .then( user =>  {res.json(user)})
    .catch( () => res.status( 500 ).send( 'issue with producing the user' ) );
  });







router.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {  
    Session.find( { userId: req.user._id } )
    .then( ( sessions ) => { 
        res.json( sessions ); 
    } )
    .catch( () => res.status( 500 ).send( 'something went wrong...' ) );
  });

router.get( '/sendSession/:sessionId', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    Session.find( { _id: req.params.sessionId } )
    .then( ( session ) => {
        res.json( session );
    } )
    .catch( () => res.status( 500 ).send( 'problem sending the session' ) );
});

//the method to update the users answers in the session
 router.patch( '/session/:sessionId/:index', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    Session.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.sessionId), {$set : {[`problems.${req.params.index}.userResponse`]: req.body.userResponse } }, { new: true } )
    .then((updated)=>{
      res.json(updated.problems[req.params.index]);
    })
    .catch((err) => {
      res.json({status: "error" , message:err.message});
    });
});

router.patch( '/session-performance/:sessionId', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
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
});

router.delete( '/remove-session/:sessionId', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    console.log('in deletion with: ', req.params.sessionId);
    Session.findByIdAndRemove(mongoose.Types.ObjectId(req.params.sessionId)
        )
        .then(
            res.status(204).json({status: "successfully deleted session", message:"sweet"})
        )
        .catch((err) => {
            res.json({ status:"error with session deletion", message: err.message})
        });
});






module.exports = router;

