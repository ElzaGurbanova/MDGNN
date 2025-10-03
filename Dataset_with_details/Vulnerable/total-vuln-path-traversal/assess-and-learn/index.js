import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import sqlite3 from "sqlite3";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import { fail } from "node:assert";

import morgan from "morgan"; // for logging requests

// TODO: use jwt?
const __dirname = import.meta.dirname;
const app = express();

app.use(morgan("dev"));

let db = new sqlite3.Database("backend.sqlite", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		password BLOB,
		salt TEXT NOT NULL,
		name TEXT NOT NULL
	  )`,
      (err) => {
        if (err) {
          console.error("Error creating table: " + err.message);
        }
      }
    );
  }
});

// cors is painful
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: "verysecurekey",
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "local",
  new Strategy((email, password, done) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) {
        return done(err);
      }
      if (!row) {
        return done(null, false, { message: "Incorrect email." });
      }

      crypto.pbkdf2(
        password,
        row.salt,
        100000,
        64,
        "sha512",
        (err, derivedKey) => {
          if (err) {
            return done(err);
          }
          console.log(
            `Comparing ${row.password.toString('hex')} with ${derivedKey.toString("hex")}`
          );
          if (
            !crypto.timingSafeEqual(
              row.password,
              derivedKey
            )
          ) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, row);
        }
      );
    });
  })
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    console.log(`Serializing user with email: ${user.email}, id: ${user.id}`);
    done(null, {
      email: user.email,
      id: user.id,
      name: user.name,
    });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

app.get("/api/questions", (req, res) => {
  const set = req.query.set || "default";
  const filePath = path.join(__dirname, "data", `${set}.json`);

  // TODO: this is definitely vulnerable to path traversal attacks
  // TODO: ensure that the file exists and is a valid JSON file

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read questions" });
    }
    res.json(JSON.parse(data));
  });
});

app.get("/api/course/:uuid", (req, res) => {
	return res.json({
		uuid: req.params.uuid,
		name: "Foobar course",
		description: "Lorem ipsum dolor sit amet",
		contents: [
			{
				uuid: "fffffffff-ffff-ffff-ffff-ffff",
				type: "assessment",
				title: "Foo Assessment",
				description: "test",
			}
		]
	});
});


app.post("/api/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log(
      `Authenticating user with email: ${req.body.username}, password: ${req.body.password}`
    );
    if (err) {
      return res
        .status(500)
        .json({ message: `Authentication error: ${err.message}` });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log in user" });
      }
      res.json({ message: "Login successful", user: user });
    });
  })(req, res, next);
});

app.post("/api/auth/register", (req, res) => {
  const { name, username: email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let salt = crypto.randomBytes(16).toString("hex");
  crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Failed to hash password" });
    }


    console.log(
      `Registering user with email: ${email}, name: ${name}, hashed password: ${hashedPassword}, salt: ${salt}`
    );

    db.run(
      `INSERT INTO users (email, password, salt, name) VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, salt, name],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({ message: `Failed to register user, err: ${err.message}` });
        }
        let user = {
          id: this.lastID,
          email: email,
          name: name,
        };
        req.login(user, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: `Failed to log in user, err: ${err.message}` });
          }
          res.json({ message: "Registration successful", user: user });
        });
      }
    );
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
