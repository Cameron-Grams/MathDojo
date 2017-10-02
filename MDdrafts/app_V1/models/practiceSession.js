//Schema to Mongoose....
const mongoose = require( 'mongoose' );

const problemSchema = mongoose.Schema( {
    operation: { String,
    firstTerm: Number,
    secondTerm: Number,
    problem: String,
    correctResponse: String, 
    userResponse: String,
    wasCorrect: Boolean
} );

const sessionSchema = mongoose.Schema( {
    problems: { type: Array }
})

const Problem = mongoose.model( 'Problem', problemSchema );
const Session = mongoose.model( 'Session', sessionSchema );

module.exports = { Problem, Session };