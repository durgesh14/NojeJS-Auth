const express = require("express");
const cookieParser = require("cookie-parser");
const expressEjsLayouts = require("express-ejs-layouts");
const app = express();

const port = 8000;
// Layouts before route
app.use(expressEjsLayouts);

//extract style and scripts from sub-pages into the layout.
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
const db = require("./config/mongoose");

//Used for session cookie and auth with passport
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo")(session);

const flash = require("connect-flash");
const customWare = require("./config/middleware");

app.use(express.urlencoded());
app.use(cookieParser());

//Set up the view engine
app.set("view engine", "ejs");

app.set("views", "./views");

//Access Static files
app.use(express.static("assets"));

//Mongo store is used to store the session cookie in the db.
app.use(
  session({
    name: "nodejsauth",
    //todo secert change
    secret: "somescecretcode",
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 100 },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoReomove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup OK");
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(customWare.setFlash);

//Use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
