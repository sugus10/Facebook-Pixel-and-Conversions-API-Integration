
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        facebookId: profile.id,
        displayName: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        accessToken: accessToken,
      };

      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          // Update user with new accessToken
          user.accessToken = accessToken;
          await user.save();
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
