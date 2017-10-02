const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//the model of the data to be generated and returned as the session object
//think this is the problem....
const { session } = require('./models/practiceSession' );

router.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/views/training.html' );
} );

router.post( '/', jsonParser, ( req, res ) => {
    const item = session.create( req.body.operation, req.body.number, req.body.min, req.body.max );
    res.status( 201 ).json( item );
})






module.exports = router;