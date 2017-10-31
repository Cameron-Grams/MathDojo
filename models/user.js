const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

//required components of the user in db, level is developed from sessions after points are awarded at each session
const UserSchema = mongoose.Schema( {
  name:{
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  level: {
    type: Number
  }
} );

UserSchema.pre( 'save', function ( next ) {  
  var user = this;
  if ( this.isModified( 'password' ) || this.isNew ) {
    bcrypt.genSalt( 10, function ( err, salt ) {
      if ( err ) {
        return next( err );
      }
      bcrypt.hash( user.password, salt, function( err, hash ) {
        if ( err ) {
          return next( err );
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});
 
// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function( pw, cb ) {  
  bcrypt.compare(pw, this.password, function( err, isMatch ) {
    if ( err ) {
      return cb( err );
    }
    cb( null, isMatch );
  });
};

const User = mongoose.model( 'User', UserSchema );  

module.exports = { User };