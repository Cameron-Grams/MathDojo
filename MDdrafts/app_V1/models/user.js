const mongoose = require( 'mongoose' );

const userSchema = mongoose.Schema( {
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}

// re-write this with Promises instead of callbacks 
//from the model, before export hash the password 
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

module.exports = mongoose.model( 'User', userSchema );  