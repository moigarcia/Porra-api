const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const User = require('../models/user.model')

passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_AUTH_CLIENT_ID,
  consumerSecret: process.env.TWITTER_AUTH_CLIENT_SECRET,
  callbackURL: process.env.TWITTER_AUTH_CALLBACK
}, async(token, tokenSecret, profile, next) => {
   const currentUser = await User.findOne( { provider_id: profile.id } )
      if (!currentUser){
        console.log("entra newUser")
       const newUser = user = new User({
          provider_id: profile.id,
          provider: profile.provider,
          name: profile.displayName,
          userTwitter: profile.username,
          photo: profile.photos[0].value
        }).save()
        if(newUser){
          console.log("newUser done ", newUser)
          next(null, newUser);
        }
      }
      console.log("currentUser ", currentUser)
      next(null, currentUser);
    }
));
