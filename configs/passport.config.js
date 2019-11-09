const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const User = require('../models/user.model')

passport.serializeUser((user, done) => {
  done(null, user.id);
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
  callbackURL: '/twitter/redirect'
}, async(token, tokenSecret, profile, done) => {
   const currentUser = User.findOne( { provider_id: profile.id } )
   console.log("entra")
      if (!currentUser){
       const newUser = user = new User({
          provider_id: profile.id,
          provider: profile.provider,
          name: profile.displayName,
          userTwitter: profile.username,
          photo: profile.photos[0].value
        }).save()
        if(newUser){
          console.log("newUser ")
          done(null, newUser);
        }
      }
      console.log("currentUser")
      done(null, currentUser);
    }
));
