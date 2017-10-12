//Schema to Mongoose....
const mongoose = require( 'mongoose' );

const sessionSchema = mongoose.Schema( {
    userId: { type: String },
    problems: { type: Array }
}, { timestamps: true } )

const Session = mongoose.model( 'Session', sessionSchema );
 
module.exports = { Session }; //don't think we need Problem...