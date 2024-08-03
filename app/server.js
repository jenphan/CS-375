let axios = require("axios");
const { response } = require("express");
let express = require("express");

const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');

let app = express();
let port = 3000;
let hostname = "localhost";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("../public"));

// Routes
app.use('/auth', authRoutes);

// Start server
app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});