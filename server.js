let axios = require("axios");
const { response } = require("express");
let express = require("express");
let app = express();
let port = 3000;
let hostname = "localhost";
app.use(express.static("public"));

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});