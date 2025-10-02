const { Router } = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github');
const { getDatabase } = require('../db');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
        ? `${process.env.BASE_URL}/oauth2/redirect/github`
        : 'http://localhost:3000/oauth2/redirect/github',
    state: false
}, async function(accessToken, refreshToken, profile, cb) {
    try {
        const db = getDatabase();
        let user = await db.collection('users').findOne({ githubId: profile.id });
        if (!user) {
            user = {
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName || profile.username
            };
            const result = await db.collection('users').insertOne(user);
            user.id = result.insertedId;
        }
        return cb(null, user); 
    } catch (error) {
        return cb(error, null);
    }
  }
));

passport.serializeUser((user, cb) => {
    cb(null, { id: user.id, username: user.username, displayName: user.displayName });
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

const router = Router();

//OAuth2 GitHub Login - route that React app calls
router.get('/auth/github', passport.authenticate('github'));

//OAuth2 GitHub Login - legacy route
router.get('/oauth2/authorize/github', passport.authenticate('github'));

router.get('/oauth2/redirect/github', passport.authenticate('github', { 
    successRedirect: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173',
    failureRedirect: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173' 
}))

router.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { 
            console.error('Error during logout:', err);
            return next(err); 
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Error destroying session' });
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.status(200).json({ message: 'Logout successful' });
        });
    });
});

module.exports = router;