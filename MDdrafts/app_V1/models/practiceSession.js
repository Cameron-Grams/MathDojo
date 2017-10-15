//Schema to Mongoose....
const mongoose = require( 'mongoose' );

const sessionSchema = mongoose.Schema( {
    userId: { type: String },
    ratioCorrect: {type: Number},
    problems: { type: Array }
}, { timestamps: true } )

const Session = mongoose.model( 'Session', sessionSchema );
 
module.exports = { Session }; //don't think we need Problem...