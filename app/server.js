let axios = require("axios");
const { response } = require("express");
let express = require("express");
let session = require("express-session");
let path = require("path");

const bodyParser = require("body-parser");
const crypto = require("crypto"); // Import crypto for generating a random string
const authRoutes = require("../routes/auth");
const quizRoutes = require("../routes/quiz");
const submissionRoutes = require("../routes/submission");
const createCourse = require("../routes/course");
const calendarRoutes = require("../routes/calendar");
const gradeRoutes = require("../routes/grades");

const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ensureAuthenticated = require("../middleware/authMiddleware"); // Import the auth middleware
const { pool } = require("./query");

let app = express();
let port = 3000;
let hostname;

// fly.io sets NODE_ENV to production automatically, otherwise it's unset when running locally
if (process.env.NODE_ENV == "production") {
  hostname = "0.0.0.0";
} else {
  hostname = "localhost";
}

// Generate a random secret key
const secretKey = crypto.randomBytes(64).toString("hex");

// Session setup
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  }),
);

/*
app.get("/", (req, res) => {
  console.log("handled by server handler");
  res.sendFile("index.html", {root: path.join(__dirname, '../public')});
});
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/auth", authRoutes);
app.use("/quiz", ensureAuthenticated, quizRoutes); // Protecting quiz routes
app.use("/submission", ensureAuthenticated, submissionRoutes); // Protecting submission routes
app.use("/course", ensureAuthenticated, createCourse); // Protecting course routes
app.use("/calendar", ensureAuthenticated, calendarRoutes); // Protecting calendar routes
app.use("/grades", ensureAuthenticated, gradeRoutes);

app.post('/upload', upload.single('image'), async (req, res) => {
  const imageName = req.file.originalname;
  const imageData = req.file.buffer;


  try {
      const result = await pool.query(
          'INSERT INTO images (name, image) VALUES ($1, $2) RETURNING id',
          [imageName, imageData]
      );
      const id = await pool.query(
        'SELECT COUNT(id) FROM images'
      )
      res.status(200).json({imageid: id.rows[0].count});
  } catch (err) {
      console.error(err);
      res.status(500).json();
  }
});

app.get('/image/:id', async (req, res) => {
  const imageId = req.params.id;
  try {
      const result = await pool.query('SELECT image FROM images WHERE id = $1', [imageId]);

      if (result.rows.length > 0) {
          const image = result.rows[0].image;
          res.writeHead(200, {
              'Content-Type': 'image/png',
              'Content-Length': image.length,
          });
          res.end(image);
      } else {
          res.status(404).json();
      }
  } catch (err) {
      console.error(err);
      res.status(500).json();
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Start server
app.listen(port, hostname, () => {
  console.log(`http://${hostname}:${port}`);
});
