//Schema to Mongoose....
const mongoose = require( 'mongoose' );

const Problem = {
    operator: String,
    firstTerm: Number,
    secondTerm: Number,
    problem: String,
    correctResponse: String, 
    userResponse: String,
    wasCorrect: null 
};

const sessionSchema = mongoose.Schema( {
    problems: { type: Array }
}, { timestamps: true } )

const Session = mongoose.model( 'Session', sessionSchema );

module.exports = { Problem, Session }; //don't think we need Problem...