const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Your Mongoose User model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4080/api/auth/google/callback",
    passReqToCallback: true
},
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            // Extract role from state if present
            let role = 'freelancer';
            if (req.query.state) {
                try {
                    const decodedState = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                    if (decodedState.role) {
                        role = decodedState.role;
                    }
                } catch (e) {
                    console.error("Error parsing Google OAuth state:", e);
                }
            }

            // Check if user already exists in our DB
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                // If not by googleId, check by email
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    // Update existing user with googleId
                    user.googleId = profile.id;
                    user.avatar = profile.photos[0]?.value;
                    await user.save();
                } else {
                    // Create new user
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0]?.value,
                        role: role
                    });
                }
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));