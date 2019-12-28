const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const User = require('../models/user.model')

passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((user, done) => {
  // User.findById(user.id, function(err, user){
  //   // console.log("des ", user)
  //   done(err, user);
  //  })
  done(null, user);
});

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_AUTH_CLIENT_ID,
  consumerSecret: process.env.TWITTER_AUTH_CLIENT_SECRET,
  callbackURL: process.env.TWITTER_AUTH_CALLBACK,
  includeEmail: true,
}, async(token, tokenSecret, profile, next) => {
  try {
    console.log("entra en try")
    const currentUser = await User.findOne( { provider_id: profile.id } )
       if (!currentUser){
        const newUser = await new User({
           provider_id: profile.id,
           provider: profile.provider,
           name: profile.displayName,
           userTwitter: profile.username,
           photo: profile.photos[0].value,
           role: profile.username === 'elmoigarcia' ? 'admin' : 'guest'
         }).save()

        next(null, newUser)
       } else {
        next(null, currentUser)
       }
     } catch(error) {
       console.log("error ", error)
      next(error)
  }}
));
