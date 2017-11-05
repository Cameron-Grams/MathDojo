const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');  
var jwt = require('jsonwebtoken'); 
const { SECRET, PORT, DATBASE_URL } = require( './config/mainConfig.js' );

const router = express.Router();
const jsonParser = bodyParser.json();
 

//two data models exported models folder
const { Session } = require( './models/practiceSession' );
const { User } = require( './models/user' );

//
//route to register a user and create the initial user db entry; from register-logic.js
router.route('/user')
    .post( ( req, res ) => {  
        if( !req.body.name || !req.body.email || !req.body.password ) {
        return res.status(400).json( { success: false, message: 'Please complete the entire form.' } );
        } else {
        User.findOne( {
            email: req.body.email 
        }).then( foundUser => { 
            if ( foundUser ){
                return res.status(400).json({ success: false, message: 'That email address already exists.'});
            } else {
                User.create( {
                    name: req.body.name,   
                    email: req.body.email,
                    password: req.body.password,
                    level: 0
                } ).then( ( createdUser ) => { 
                       res.json( createdUser );
                    } )
                } 
            })
        }
});
   
//Authentication if user exists; endpoint called from login-logic.js
router.route('/user/authenticate')
    .post( ( req, res ) => {  
    User.findOne({
      "email" : req.body.email
    } ).then
    ( user => {
        if ( !user ){
            res.status( 400 ).send( { success: false, message: 'Authentication failed. User not found.' } );
        } else {
            user.comparePassword( req.body.password, ( err, isMatch ) => {
                if ( isMatch && !err ){
                    var token = jwt.sign( 
                        { id: user._id, userName: user.name, level: user.level }, 
                        SECRET, {
                        expiresIn: 6000000
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
    .get(passport.authenticate('jwt', { session: false }), (req, res) => {  
        Session.find( { userId: req.user._id } )
        .then( sessions => { 
            res.json( sessions ); 
        } )
        .catch( () => res.status( 500 ).send( 'something went wrong...' ) );
  });

module.exports = router;
