import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from '../model/userModel.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1) Try to find by provider id
                let user = await User.findOne({ googleId: profile.id });

                // 2) If not found, try to find by email and link accounts
                if (!user && profile.emails?.[0]?.value) {
                    user = await User.findOne({
                        email: profile.emails[0].value,
                    });
                    if (user) {
                        user.googleId = profile.id;
                        user.profileImage = user.profileImage || {
                            url: profile.photos?.[0]?.value,
                        };
                        await user.save();
                        return done(null, user);
                    }
                }

                // 3) If still not found, create a new user
                if (!user) {
                    const email = profile.emails?.[0]?.value; // may be undefined
                    const username = email
                        ? email.split('@')[0]
                        : `google_${profile.id}`;
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email,
                        username,
                        profileImage: { url: profile.photos?.[0]?.value },
                        // omit password for social accounts
                    });
                }

                return done(null, user);
            } catch (err) {
                // optional: special-case duplicate key errors if they still occur
                if (err && err.code === 11000) {
                    // find the existing user and return it
                    const existing = await User.findOne({
                        email: profile.emails?.[0]?.value,
                    });
                    if (existing) return done(null, existing);
                }
                return done(err, null);
            }
        }
    )
);

// Facebook
// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: process.env.FACEBOOK_CLIENT_ID,
//             clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//             callbackURL: '/auth/facebook/callback',
//             profileFields: ['id', 'displayName', 'emails', 'photos'],
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 let user = await User.findOne({ facebookId: profile.id });
//                 if (!user) {
//                     user = await User.create({
//                         facebookId: profile.id,
//                         name: profile.displayName,
//                         email: profile.emails?.[0]?.value,
//                         username:
//                             profile.emails?.[0]?.value?.split('@')?.[0] ||
//                             profile.username ||
//                             `fb_${profile.id}`,
//                         profileImage: { url: profile.photos?.[0]?.value },
//                     });
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 return done(error, null);
//             }
//         }
//     )
// );

// Twitter
passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CLIENT_ID,
            consumerSecret: process.env.TWITTER_CLIENT_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL,
            includeEmail: true,
        },
        async (token, tokenSecret, profile, done) => {
            try {
                let user = await User.findOne({ twitterId: profile.id });
                if (!user) {
                    user = await User.create({
                        twitterId: profile.id,
                        name: profile.displayName || profile.username,
                        email: profile.emails?.[0]?.value, // may be undefined if not provided
                        username: profile.username || `tw_${profile.id}`,
                        profileImage: { url: profile.photos?.[0]?.value },
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
