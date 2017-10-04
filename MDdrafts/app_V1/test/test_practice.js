const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const { Session } = require('../models/practiceSession' );
const { app, runServer, closeServer } = require('../app');
const { TEST_DATABASE_URL } = require('../.config');

chai.use( chaiHttp );
 

function generateTerm( min, max ){
    return Math.floor( Math.random() * ( max - min ) + min );
  }
  
function generateNewSession(){
    let sendTest = {
        operation: '+',
        number: 3,
        min: 1,
        max: 100
    };
    return sendTest; 
}

function tearDownDb(){
    console.warn( 'Deleting TEST_DATABASE' );
    return mongoose.connection.dropDatabase();
}

describe( 'End-point for practice session resources', function() {
    before( function() {
      return runServer( TEST_DATABASE_URL );
    });
 
    afterEach( function() {
      return tearDownDb();
    });
  
    after( function() {
      return closeServer();
    })

    describe('POST endpoint to create practice session', function() {
        it( 'should create a practice session', function() {
    
          const newPracticeSession = generateNewSession();
    
          return chai.request( app )
            .post( '/api/generate-session' )
            .send( newPracticeSession )
            .then(function(res) {
             res.should.have.status(201);
             res.should.be.json;
 //             res.body.should.be.a( 'object' );
 //             res.body.should.include.keys(
 //               'problems' );
 //             res.body.problems.should.be.a( 'array' );
 //             res.body.id.should.not.be.null;
              return Session.findById( res.body._id );
            })
            .then(function( session ){ 
              session.problems.should.equal( session.problems );
            });
        });
    });
} );

// ExtractJwt.fromAuthHeader
//ExtractJwt.fromAuthHeaderAsBearerToken