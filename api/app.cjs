const express = require('express');
const redis = require('redis');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();

const app = express();
app.use(express.json());

const client = redis.createClient();
async function connectToDB() {
    await client.connect();
    await client.flushAll();    // Clear DB
}

app.post('/register', async (req, res) => {
    try {
        // Check if user exists already
        if(await client.hExists(req.body.username, "password")) {
            res.status(409);
            res.send("User already exists");
        } else {
            // Create a hashed password and add the user to the database
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await client.hSet(req.body.username, "password", hashedPassword);
            res.status(200);
            res.send("User created");
        }
    } catch(err) {
        res.status(500);
        res.send({error: err});
    }
})

connectToDB();
app.listen(process.env.PORT, () => { console.log(`App started on: http://localhost:${process.env.PORT}`) })