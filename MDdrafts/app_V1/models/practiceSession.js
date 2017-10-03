//Schema to Mongoose....
const mongoose = require( 'mongoose' );

const Problem = {
    operator: String,
    firstTerm: Number,
    secondTerm: Number,
    problem: String,
    correctResponse: String, 
    userResponse: String,
    wasCorrect: Boolean
};

const sessionSchema = mongoose.Schema( {
    problems: { type: Array }
})

const Session = mongoose.model( 'Session', sessionSchema );

module.exports = { Problem, Session };