const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const User = require('../models/user.model')

passport.serializeUser((user, next) => {
  next(null, user._id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => {
      next(null, user);
    })
    .catch(error => next(error));
});

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_AUTH_CLIENT_ID,
  consumerSecret: process.env.TWITTER_AUTH_CLIENT_SECRET,
  callbackURL:  process.env.URL_APP
}, function authenticateOAuthUser(accessToken, refreshToken, profile, done) {
  console.log("entra ")
   User.findOne( { provider_id: profile.id } )
    .then(user => {
      if (user){
        done(null, user);
      } else {
        user = new User({
          provider_id: profile.id,
          provider: profile.provider,
          name: profile.displayName,
          userTwitter: profile.username,
          photo: profile.photos[0].value
        })
        return user.save()
          .then(user => {
            console.log("entra ", user)
            done(null, user);
          })
          // .catch(error => next(error));
      }
      
    })
    .catch(error => next(error));
}
));