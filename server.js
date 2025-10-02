import dotenv from 'dotenv'
import express from 'express'
import ViteExpress from 'vite-express'
import session from 'express-session'
import passport from'passport'
import { Strategy as GitHubStrategy } from'passport-github'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

dotenv.config();
const config = {
  secret: process.env.VITE_SESSION_SECRET,
}

const app = express()
app.use( express.json());

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.use(session({
  secret: process.env.VITE_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user);
})
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
})

passport.use(new GitHubStrategy({
      clientID: process.env.VITE_GITHUB_CLIENT_ID,
      clientSecret: process.env.VITE_GITHUB_CLIENT_SECRET,
      callbackURL: process.env.VITE_OAUTH_CALLBACK
    },
    async function(accessToken, refreshToken, profile, cb) {
      const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName
      };
      return cb(null, user);
    }
));

function requireAuth(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/login.html');
  }
}

function fetchAuth(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({error: 'Please log in.'});
  }
}

app.use(express.static(path.join(dirname, 'dist')));
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(dirname, 'dist', 'index.html'));
});
app.get('/index.html', requireAuth, (req, res) => {
  res.sendFile(path.join(dirname, 'dist', 'index.html'));
});

const calculateProgress = function ( watched, total ) {
  const p = Math.floor((watched / total) * 100);
  if (p > 100) {
    return "100%";
  } else if (p >= 0) {
    return p + "%";
  } else {
    return "0%";
  }
}

const uri = `mongodb+srv://${process.env.VITE_USERNM}:${process.env.VITE_PASS}@${process.env.VITE_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;

async function run() {
  try {
    await client.connect();

    collection = client.db("myDatabase").collection("myCollection");
    await client.db("myDatabase").command({ ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.log("err :", err);
    await client.close();
  }
}

app.use((req, res, next) => {
  if (collection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

app.get('/auth/github',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/github' }),
    function(req, res) {
      res.redirect('/');
});

app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if(err) {
      return next(err);
    }
    res.redirect('/login.html');
  });
});

app.get('/user', (req, res) => {
  if(!req.user) {
    return res.json({authenticated: false});
  } else {
    res.json({authenticated: true, user: req.user});
  }
})

app.get("/results", fetchAuth, async (req, res) => {
  const username = req.user.username;
  if (collection !== null) {
    const docs = await collection.find({username: username}).toArray()
    res.json(docs)
  }
})

app.post('/submit', fetchAuth, async (req, res) => {
  const data = req.body;
  data.progress = calculateProgress(data.watched, data.episodes);

  data.userId = req.user.id;
  data.username = req.user.username;

  const result = await collection.insertOne(data);
  res.json(result);
})

app.post('/delete', fetchAuth, async (req, res) => {
  if(req?.body?._id) {
    const result = await collection.deleteOne({
      _id: new ObjectId(req.body._id)
    })
    res.json(result)
  } else {
    console.log("Id not found.")
    res.status(500).send();
  }
})

app.post('/update', fetchAuth, async (req, res) => {
  if(req?.body?._id) {
    const data = {[req.body.field]: req.body.newInfo, watched: req.body.watched, episodes: req.body.episodes};
    data.progress = calculateProgress(data.watched, data.episodes);

    const result = await collection.updateOne(
        { _id: new ObjectId(req.body._id)},
        { $set: data},
    )
    res.json(result)
  } else {
    console.log("Id not found.")
    res.status(500).send();
  }
})

run().catch(console.dir);

ViteExpress.listen( app, 3000, () => {
  console.log('Server + Vite running');
} )