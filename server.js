require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const db = require("./config");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

db().then((connection) => {
  app.use(
    expressSession({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: { secure: true },
      store: new MongoStore({ mongooseConnection: connection }),
    })
  );
});

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "developement") {
  app.use(express.static("client/build"));
}

app.use("/api/clients", require("./routes/clients"));
app.use("/api/employees", require("./routes/employees"));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.listen(PORT, () => {
  console.log(`PORT ${PORT}`);
});
