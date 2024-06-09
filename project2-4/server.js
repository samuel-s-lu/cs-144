import express from "express";
import http from "http";
import path from "path";
import bodyParser from "body-parser"
import session from "express-session"
import cookieParser from "cookie-parser"

import updater from "./lib/server/updater.js";
import { connectToDB, authenticate, checkCookie, getCards, saveCards } from "./database.js"

connectToDB();

const PORT = process.env.PORT || 1930;

const app = express();
const server = http.createServer(app);

const dirname = process.cwd();
const publicPath = path.join(dirname, "public");
console.log(`Serving files from ${publicPath}`);
app.use("/lib/client", express.static(path.join(dirname, "lib", "client")));
app.use(express.static(publicPath));
updater(server, publicPath);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'abc123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

async function checkAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  }
  else if (req.cookies.login) {
    await checkCookie(req.cookies.login)
      .then(success => {
        if (success) next();
      });
  }
  else {
    res.redirect('/');
  }
}

app.post('/', (req, res) => {
  console.log(req.body);
  const { username, password, remember } = req.body;
  console.log(username, password, remember);

  req.session.isAuthenticated = false;

  authenticate(username, password)
    .then(success => {
      console.log(success);
      if (success === true) {
        console.log("authentication successful");
        req.session.isAuthenticated = true;
        if (remember) {
          res.cookie('login', username);
        }
        res.json({ success: true, user: username });
      }
      else {
        console.log("authentication failed");
        res.json({ success: false });
      }
    });
});

app.post('/logout', (req, res) => {
  console.log('posted to logout');
  res.clearCookie('login');
  req.session.isAuthenticated = false;
  res.redirect('/');
});

app.post('/get-cards', (req, res) => {
  const { user } = req.body;
  getCards(user)
    .then((data) => {
      console.log("data", data);
      res.json( {data: data} );
    });
});

app.post('/save-cards', (req, res) => {
  const { user, todo, doing, done } = req.body;
  saveCards(user, todo, doing, done);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, "login.html"));
});

app.get('/notes', checkAuth, (req, res) => {
  res.sendFile(path.join(publicPath, "notes.html"));
});


server.listen(PORT, () => {
  console.log(`Server started. Now open http://localhost:${PORT}/ in your browser.`);
});
