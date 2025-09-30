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

ViteExpress.config({ mode: "development" });
let callbackURL = "http://localhost:3000"
if (process.env.RUN_ENV != "development") {
  ViteExpress.config({ mode: "production" });
  callbackURL = "https://a4-brendanleu.brleu.com"
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


// app.use(express.urlencoded({ extended: true })) // Handle forms
app.use(express.json()); // Handle JSON


function enforce_logged_out(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) res.redirect(302, '/portal')
  else next()
}

function enforce_logged_in(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) res.status(401).send("User is not authenticated.");
  else next()
}

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