var JwtStrategy = require( 'passport-jwt' ).Strategy;  
var ExtractJwt = require( 'passport-jwt' ).ExtractJwt;  
var { User } = require('../models/user');  
var config = require('../config/mainConfig');

// Setup work and export for the JWT passport strategy
//basic strategy finds a user by the user id in the mongo db by reading the user id from the token 
//that token is built in the user athentication of the userRouter
const basicStrategy = function(passport) {  
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.SECRET;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id}, function(err, user) {   
      if (err) {
        console.log('error in the strategy');
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};

module.exports = { basicStrategy };
