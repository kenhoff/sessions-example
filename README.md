# Sessions example

(with express and mongo)

## Running

-   clone
-   `yarn` to install dependencies
-   `node server.js`
-   open a browser to <http://localhost:1234>. It'll also be beneficial for you to inspect the network requests and saved cookies with devtools.
    -   (there's no frontend updating indicating whether or not you're signed in, besides the session set in the cookies.)
-   I'd also recommend having a mongo client open somewhere, to inspect the `sessions-testing-app` collection.
