const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid email or password' });
                }

                // Create JWT token
                const token = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return done(null, { user, token });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
