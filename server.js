const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// -----------------------------------------------------------------------------

// mocking out a data store
let users = [{
    username: "ken",
    id: 1234
}, {
    username: "tristan",
    id: 5678
}]

let app = express();

// set up session middleware
// this takes the session ID from the cookie, looks up the session data in mongo, and populates the session data on req.session if it exists.
app.use(session({
    secret: "asdf",
    store: new MongoStore({
        url: "mongodb://localhost:27017/sessions-testing-app"
    })
}))

// middleware for populating user object, if it exists
// usually you'll store the user objects in mongo, and just look up the user object in there
app.use((req, res, next) => {
    if (req.session.user) {
        req.user = users.find((user) => {
            return (parseInt(user.id) == parseInt(req.session.user))
        })
    }
    next()
})

app.get("/api-request", (req, res) => {
    // if req.user exists, then it's already been populated by our middleware. if not, then the middleware wasn't able to find the user, and the user hasn't been signed in.
    if (req.user) {
        res.status(200).send()
    } else {
        res.status(401).send()
    }
})

app.post("/sign-in", (req, res) => {
    // for demonstration purposes, we're just assuming that it's always user 1234 signing in.
    // (in a production environment with a username/password authentication method, you'll have a look at the username/password sent in the body of the request and compare it to the data store instead.)
    // **any information set on the req.session object will be saved to the session object in mongo, _not_ on the user's browser.** (in this case, just the user ID, because we want to deserialize that on every API call.)
    req.session.user = 1234
    res.status(200).send()
})

app.post("/sign-out", (req, res) => {
    // check out https://github.com/expressjs/session#reqsession for some of these methods.
    delete req.session.destroy((err) => {
        // err shoudl be null
        res.status(200).send();
    })
})

// boilerplate -----------------------------------------------------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(1234, () => {
    console.log("Listening on 1234...");
})
