import dotenv from 'dotenv'; // Load .env
dotenv.config()

// Imports
import * as crypto from "crypto";
import path from 'path';
import express from 'express';
import ViteExpress from "vite-express";
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import url from 'url';
import compression from 'compression';

// Types
import type { Request, Response, NextFunction } from 'express';
import type { Profile } from 'passport-github2';

// Routers
import { router as dataRouter } from "./routes/api/data.js";
import { router as userRouter } from "./routes/api/user.js";
import { router as authRouter } from "./routes/auth.js";

// MongoDB Models
import { UserModel as User } from "./models/user.js";

// console.log(`env vars: ${process.env}`)

// Express App
const app = express();
const port = parseInt(process.env.PORT || "3000");
app.use(compression())

// Database
const client_promise = mongoose.connect(process.env.A3_DATABASE_MONGODB_URI!)
.then(m => m.connection.getClient())

// Session handling
app.use(session({
  secret: 'secrettexthere',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,            //setting this false for http connections
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000) 
  },
  store: MongoStore.create({
    clientPromise: client_promise,
    dbName: "test",
    stringify: false,
    autoRemove: 'interval',
    autoRemoveInterval: 1
  }),
}));
app.use(passport.authenticate('session'));

// User strategy
const strategy = User.createStrategy()
passport.use(strategy);
passport.serializeUser(User.serializeUser() as any); // Weird TS hack see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/54932
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

let callbackURL = "http://localhost:3000"
if (process.env.RUN_ENV != "development") {
  callbackURL = "https://a3-brendanleu.brleu.com"
}

// Github Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: callbackURL + "/auth/github/callback"
  },
  (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err?: Error | null, profile?: any) => void
  ) => {
    const email = profile.emails![0]!.value
    
    User.findOne({ githubId: profile.id, email: email,})
    .then((user) => {
      // console.log(user)
      if (!user) {
        User.register(
          new User({ 
            githubId: profile.id,
            email: email,
            username: profile.username 
          }), random_password(16), (err, newUser) => {
            // console.log("err: "+err)
            // console.log("new_usr:"+newUser)
            if (err) { return done(err) }
            else { return done(null, newUser) }
          }
        )
      } else {
        return done(null, user);
      }
    }).catch((e) => done(e))
  }
));

// Handle forms instead of JSON
app.use(express.urlencoded({ extended: true }))

// Static file middleware 
function enforce_files(req: Request, res: Response, next: NextFunction) {
  const logged_out = [
    '/login.html',
    '/register.html',
    '/',
    '/index.html'
  ]
  const logged_in = [
    '/portal.html',
  ]

  // console.log(req)
  const file_url_path = url.parse(req.url, true).pathname!
  if (logged_out.includes(file_url_path)) {
    return enforce_logged_out(req, res, next)
  } else if (logged_in.includes(file_url_path)) {
    return enforce_logged_in(req, res, next)
  } else return next()
}

function enforce_logged_out(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) res.redirect(302, '/portal.html')
  else next()
}

function enforce_logged_in(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) res.redirect(302, '/');
  else next()
}

// Serve static files in public/
let static_file_folder = path.resolve(import.meta.dirname, '..', 'public')

// Serve index.html as root (for some reason vercel is not respecting this with express.static)
// app.get('/', enforce_logged_out, (req, res) => {
//   console.log(static_file_folder + '/index.html')
//   res.sendFile(static_file_folder + '/index.html')
// })

app.use(enforce_files, express.static(static_file_folder));

app.use('/api', enforce_logged_in, dataRouter)
app.use('/api', enforce_logged_in, userRouter)
app.use('/auth', authRouter)

// Start server
ViteExpress.listen(app, port, () => {
  console.log(`Vite app listening on port ${port}`);
});

// Random password generator
function random_password(length: number) {
  let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i]! % characters.length;
    password += characters[randomIndex];
  }
  return password;
}