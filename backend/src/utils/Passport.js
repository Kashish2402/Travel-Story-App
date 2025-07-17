import dotenv from "dotenv"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.models.js"
dotenv.config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://travel-story-app-xxsu.onrender.com/api/v1/users/google/callback"
},

    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value })

            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    profilePic: profile.photos[0].value,
                    gender: "Not specified",
                    dateOfBirth: new Date("2000-01-01"),
                    password: Math.random().toString(36).slice(-8),
                    username: profile.displayName.toLowerCase().replace(/\s/g, "") + Date.now().toString().slice(-4),
                })

            }
            else {
                if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save()
                }
            }

            return done(null, user)
        } catch (error) {
            console.error("Error in Google OAuth strategy:", err);
            return done(err, null);
        }
    }))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
