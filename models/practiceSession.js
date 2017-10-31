//Schema to Mongoose....
const mongoose = require( 'mongoose' );

//elements of the session entry in the db 
const sessionSchema = mongoose.Schema( {
    userId: { 
        type: String 
    },
    ratioCorrect: {
        type: Number
    },
    pointsAwarded:{
        type:Number
    },
    problems: { 
        type: Array 
    }
}, { 
    timestamps: true 
} )

const Session = mongoose.model( 'Session', sessionSchema );
 
module.exports = { Session }; 