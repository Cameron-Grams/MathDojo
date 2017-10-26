var JwtStrategy = require( 'passport-jwt' ).Strategy;  
var ExtractJwt = require( 'passport-jwt' ).ExtractJwt;  
var { User } = require('../models/user');  
var config = require('../config/mainConfig');

// Setup work and export for the JWT passport strategy

const basicStrategy = function(passport) {  
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
//  opts.secretOrKey = config.JWT_SECRET;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id}, function(err, user) {
      if (err) {
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