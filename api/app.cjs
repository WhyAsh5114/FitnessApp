const express = require('express');
const redis = require('redis');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const res = require('express/lib/response');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv').config();


const app = express();
app.use(express.json());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

const client = redis.createClient();
async function connectToDB() {
    await client.connect();
    await client.flushAll();    // Clear DB
}

passport.use(new LocalStrategy(async (username, password, done) => {
    const storedPassword = await client.hGet(username, "password");
    if (storedPassword === null) {
        done(null, false, { message: 'User does not exist' });
    } else {
        if (await bcrypt.compare(password, storedPassword)) {
            done(null, username, { message: 'Logged in successfully' });
        } else {
            done(null, false, { message: 'Incorrect password' });
        }
    }
}));

app.post('/register', async (req, res) => {
    // Check if user exists already
    if (await client.hExists(req.body.username, "password")) {
        res.status(409);
        res.send("User already exists");
    } else {
        // Create a hashed password and add the user to the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await client.hSet(req.body.username, "password", hashedPassword);
        res.status(200);
        res.send("User created");
    }
})

app.post('/login', async (req, res) => {
    passport.authenticate('local', (error, user, info) => {
        if(error) {
            res.status(500).json(error);
        } else if (user) {
            res.status(200).json(info);
        } else {
            res.status(401).json(info);
        }
    })(req, res);
})

connectToDB();
app.listen(process.env.PORT, () => { console.log(`App started on: http://localhost:${process.env.PORT}`) })