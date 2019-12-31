const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const User = require("../models/user.model");

passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((user, done) => {
  User.findById(user.id, function(err, user) {
    done(err, user);
  });
  // done(null, user)
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_AUTH_CLIENT_ID,
      consumerSecret: process.env.TWITTER_AUTH_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_AUTH_CALLBACK_DEV,
      includeEmail: true
    },
    (token, tokenSecret, profile, next) => {
      User.findOne({ provider_id: profile.id })
        .then(currentUser => {
          if (!currentUser) {
            const newUser = new User({
              provider_id: profile.id,
              provider: profile.provider,
              name: profile.displayName,
              userTwitter: profile.username,
              photo: profile.photos[0].value,
              role: profile.username === "elmoigarcia" ? "admin" : "guest"
            }).save();

            next(null, newUser);
            console.log("new user", newUser);
          } else {
            next(null, currentUser);
          }
        })
        .catch(error => {
          console.log("error ", error);
          next(error);
        });
    }
  )
);
