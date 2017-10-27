const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

const userSchema = mongoose.Schema( {
  name:{
    type: String,
    lowercase: true,
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
  level: {type: Number}
} );

userSchema.pre( 'save', function ( next ) {  
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
userSchema.methods.comparePassword = function( pw, cb ) {  
  bcrypt.compare(pw, this.password, function( err, isMatch ) {
    if ( err ) {
      return cb( err );
    }
    cb( null, isMatch );
  });
};
 

userSchema.methods.hashPassword = function(password){
    bcrypt.genSalt( 10, function ( err, salt ) {
      if ( err ) {
        return next( err );
      }
      bcrypt.hash( user.password, salt, function( err, hash ) {
        if ( err ) {
          return next( err );
        }
        password = hash;
        next();
      });
    });
  };




const User = mongoose.model( 'User', userSchema );  

module.exports = { User };