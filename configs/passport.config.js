const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const User = require('../models/user.model')

passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_AUTH_CLIENT_ID,
  consumerSecret: process.env.TWITTER_AUTH_CLIENT_SECRET,
  callbackURL: process.env.TWITTER_AUTH_CALLBACK_DEV
}, async(token, tokenSecret, profile, next) => {
  try {
    const currentUser = await User.findOne( { provider_id: profile.id } )
       if (!currentUser){
         console.log("entra newUser")
        const newUser = await new User({
           provider_id: profile.id,
           provider: profile.provider,
           name: profile.displayName,
           userTwitter: profile.username,
           photo: profile.photos[0].value,
           role: profile.username === 'elmoigarcia' ? 'admin' : 'guest'
         }).save()
           next(null, newUser);
       }
       next(null, currentUser);
     } catch(error) {
      next(error)
  }}
));
