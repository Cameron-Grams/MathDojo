const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const { Session } = require('../models/practiceSession' );
const {User} = require('../models/user');

const { app, runServer, closeServer } = require('../app');
const { TEST_DATABASE_URL } = require('../config/mainConfig');
const {secret} = require('../config/mainConfig');

const jwt = require('jsonwebtoken');


chai.use( chaiHttp );
  
function generateNewUser(){
  const newUser = {
    name: 'testName',
    email: 'test@test.com',
    password: 'password'
  };
  return newUser;
}

function addUser(){
  const name = "random";
  const email = "random@random.com";
  const password = "password2";

  return User.create({
    name,
    email,
    password
  });
}





function tearDownDb(){
    console.warn( 'Deleting TEST_DATABASE' );
    return mongoose.connection.dropDatabase();
}

describe( 'End-point for practice session resources', function() {
    before( function() {
      return runServer( TEST_DATABASE_URL );
    });

    beforeEach( function(){
      return addUser();
    })

    afterEach( function() {
      return tearDownDb();
    });
 
    after( function() {
      return closeServer();
    })

    describe('Test endpoints to create users and practice session:  ', function() {
        it( 'should create a new User', function() {
          const newUser = generateNewUser();
    
          return chai.request( app )
            .post('/api/user')
            .send(newUser)
            .then(function(res) {
             res.should.have.status(200);
             res.should.be.json;
             return User.findById( res.body._id );
            })
            .then(function( user ){ 
              user.email.should.equal( user.email );
            });
        });


      it( 'should authenticate the user', function(){
          const user = {
            email:'random@random.com',
            password:'password2' 
          };

          return chai.request(app)
            .post('/api/user/authenticate')
            .send(user)
            .then( (res) => {
              res.should.have.status(200);
              res.should.be.json;
              return User.findById(res.body._id);
            })
            .then( (user) => {
              user._id.should.equal(user._id);
            });
        });
         

       it( 'should not authenticate the user if wrong email', function(){
          const user = {
            email:'randomBadEmail@random.com',
            password:'password2' 
          };
          return chai.request(app)
            .post('/api/user/authenticate')
            .send(user)
            .catch( (res) => {
              res.should.have.status(400);
            })
        });


       it( 'should not authenticate the user if wrong password good email', function(){
          const user = {
            email:'random@random.com',
            password:'BadPassword2' 
          };
          return chai.request(app)
            .post('/api/user/authenticate')
            .send(user)
            .catch( (res) => {
              res.should.have.status(400);
            })
        });

//test the session endpoints
       it( 'should return a session with proper request', function(){
          const user = new User({
              name: 'random2',
              email: 'random2@random.com',
              password: 'Password2'
            });


          user.save( (err) => {
            if (err){
              console.log( err.message);
              }
          });

          const token = jwt.sign({
            id: user._id,  //the issue is that this is being encoded incorrectly....
            userName: user.name,
            level: 0
            }, secret, {
            expiresIn: 60 * 60
            });
          
          console.log( "user id: ", user._id);
          console.log( 'token is: ', token );

          const practiceRequest = {
            operation: "+",
            number: "10",  ///this will possible need to be sent as a number
            min: "1",
            max: "200"
          };

          return chai.request(app)
            .post('/api/session')
            .set('Authorization', `Bearer ${token}`)
            .send( practiceRequest )
            .then( (res) => {
              res.should.have.status(201);
            })
          });

    });
} );



//example language...
/*
const token = jwt.sign({
  id: someUserThatYouGetFromDB._id,
}, JWT_SECRET, {
  expiresIn: 60 * 60
});

// Set auth using this aproach
.post('/api/session')
.set('Authorization', 'Bearer ' + token)
*/