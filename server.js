let axios = require("axios");
const { response } = require("express");
let express = require("express");
let app = express();
let port = 3000;
let hostname = "localhost";
app.use(express.static("public"));


/* database stuff */
const pg = require("pg");
const env = require("./env.json");
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
  console.log(`Connected to database ${env.database}`);
});



app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});