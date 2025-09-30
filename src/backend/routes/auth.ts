import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import passport from 'passport';
export const router = express.Router();

// MongoDB Models
import { UserModel as User } from "../models/user.js";

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect(303, '/login?status=out');
  });
});

// local (username/password)
router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err: any, user: any, info: any) {      
      if (err) {
        return res.status(401).json(err);
      }
      if (user) {
        return res.status(200).json(user);
      } else {
        res.status(401).json(info);
      }
    })(req, res, next);
})

router.post('/register', (req, res) => {
  // Password confirmation
  if (req.body.password !== req.body.password_conf) {
    const err = "passwords must match"
    return res.status(401).json(err);
  }

  // Email validation
  const email_format = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!req.body.email.match(email_format)) {
    const err = "email must be valid"
    return res.status(401).json(err);
  }

  User.register(
    new User({ 
      email: req.body.email, 
      username: req.body.username 
    }), req.body.password, (err, msg) => {
      if (err) {
        console.error(err);
        return res.status(401).json(err);
      } else {
        return res.status(200).json(msg);
      }
    }
  )
})

// Github Auth
router.get(
  '/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get(
  '/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login?status=fail&err=github' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);