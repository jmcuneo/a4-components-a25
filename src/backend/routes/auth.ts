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
    res.redirect(303, '/login.html?status=out');
  });
});

// local (username/password)
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login.html?status=fail',
    failureMessage: true,
    successRedirect: '/'
  }
  // , (err: string | undefined, user: typeof User, info: any, status: any) => {
  //   console.log(err)
  //   console.log(user)
  //   console.log(info)
  //   console.log(status)
  // }
  ),
  (err: string | undefined, req: Request, res: Response, next: NextFunction) => {
    if (err) { return next(err); }
  }
)

router.post('/register', (req, res) => {
  // Password confirmation
  if (req.body.password !== req.body.password_conf) {
    const err = "passwords must match"
    res.redirect(303, `/register.html?status=fail&err=${encodeURIComponent(err)}`);
  }

  // Email validation
  const email_format = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!req.body.email.match(email_format)) {
    const err = "email must be valid"
    res.redirect(303, `/register.html?status=fail&err=${encodeURIComponent(err)}`);
  }

  User.register(
    new User({ 
      email: req.body.email, 
      username: req.body.username 
    }), req.body.password, (err, msg) => {
      if (err) {
        console.error(err);
        res.redirect(303, `/register.html?status=fail&err=${encodeURIComponent(err)}`);
      } else {
        res.redirect(303, '/login.html?status=success');
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
  passport.authenticate('github', { failureRedirect: '/login.html?status=fail&err=github' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);