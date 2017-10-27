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
 

//
//route to register a user and create the initial user db entry; from register-logic.js
router.route('/user')
    .post( function( req, res ) {  
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
  
//Authentication if user exists; endpoint called from login-logic.js
router.route('/user/authenticate')
    .post(function( req, res ) {  
    User.findOne({
      "email" : req.body.email
    } ).then
    ( ( user ) => {
        if ( !user ){
            res.status( 400 ).send( { success: false, message: 'Authentication failed. User not found.' } );
        } else {
            user.comparePassword( req.body.password, function( err, isMatch ) {
                if ( isMatch && !err ){
                    console.log( 'good authentication', user );
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



//populates the dashboard with the user performance sessions from the checkUser() in index-logic.js  
router.route('/user/basic-info')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {  
        Session.find( { userId: req.user._id } )
        .then( ( sessions ) => { 
            res.json( sessions ); 
        } )
        .catch( () => res.status( 500 ).send( 'something went wrong...' ) );
  });

module.exports = router;


