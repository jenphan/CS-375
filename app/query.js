/* database stuff */
const { Pool } = require('pg');
const fs = require('fs');
const { register } = require('module');
const argon2 = require('argon2'); // linh changed

// Load environment configuration
const envConfig = JSON.parse(fs.readFileSync('../env.json', 'utf8'));

const pool = new Pool({
    user: envConfig.DATABASE_USER,
    host: envConfig.DATABASE_HOST,
    database: envConfig.DATABASE_NAME,
    password: envConfig.DATABASE_PASSWORD,
    port: envConfig.DATABASE_PORT,
});

/* QUERY FUNCTIONS */
  // linh changed - async await juust for wait while waiting for a process of database query to complete
  async function registerAccount(username, password, role, req, res) {
    try {
      const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
      if (result.rows.length !== 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      // Hash the password
      const hashedPassword = await argon2.hash(password);
      await pool.query(`INSERT INTO users(username, password, role) VALUES($1, $2, $3)`, [username, hashedPassword, role]);
      console.log("successful account insert");
      return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.log("Error registering account:", error);
      return res.status(500).json({ message: 'Account creation error' });
    }
  }
  
  function updateUsername(userid, username){
    if ((username === "")){
      return -2;
    }
    pool.query(`UPDATE users SET username = $1 WHERE usrID = $2`, [username, userid]).then(result => {
      console.log("successful username update");
    }).catch(error => {
      console.log("username update error");
    });
  }
  
  // linh changed
  async function updatePassword(userid, password) {
    if (!password) {
      return -2;
    }
    try {
      const hashedPassword = await argon2.hash(password);
      await pool.query(`UPDATE users SET password = $1 WHERE usrid = $2`, [hashedPassword, userid]);
      console.log("successful password update");
    } catch (error) {
      console.log("password update error:", error);
    }
  }
  
  
  function addCourse(crn, num, dept, title, profID, code, req, res){
    pool.query(`SELECT * FROM courses WHERE crn = $1`, [crn]).then(result => {
      console.log(result.rows);
      if (result.rows.length !== 0){
        return res.status(400).json({ message: 'Course with provided CRN already exists' });
      }
      else{
        pool.query(`INSERT INTO courses(crn, department, number, title, professorid, registrationcode) VALUES($1, $2, $3, $4, $5, $6)`, [crn, dept, num, title, profID, code]).then(result =>{
          console.log("successful course creation");
          enroll(profID, code, req, res);
        }).catch(error => {
        console.log("course creation error");
        return res.status(500).json({ message: 'course creation error' });
        });
      }
    });
  }

  function enroll(userid, regCode, req, res){
    console.log(regCode);
    pool.query(`SELECT crn FROM courses WHERE registrationcode = $1`, [regCode]).then(result => {
      let crn = result.rows[0].crn;
      console.log("crn:" + crn);
      pool.query(`INSERT INTO enrollment(usrid, courseCRN) VALUES ($1, $2)`, [userid, crn]).then(result =>{
        console.log("sucessfully enrolled in course");
        return res.status(200).json({message: 'user now in course'})
        }).catch(error => {
          console.log("course enrollment error");
          console.log(error);
          return res.status(500).json({message: 'course enrollment error'})
        })
    }).catch(error =>{
      console.log("invalid registration code");
      return res.status(500).json({message: 'invalid registration code'})
    });
  }
     
  
  function updateTitle(crn, title = ""){
    if(title === ""){
      return -2;
    }
  
    return pool.query(`UPDATE courses SET title = $1 WHERE crn = $2`, [title, crn]).then( result => {
      console.log("successful course name update");
    }).catch(error => {
      console.log("course name update error");
      throw new Error("Title could not be updated");
    })
  }
  
  function updateProfessor(crn, profID =  ""){
    if(profID === ""){
      return -2;
    }
  
    return pool.query(`UPDATE courses SET professorid = $1 WHERE crn = $2`, [profID, crn]).then( result => {
      console.log("successful course professor update");
    }).catch(error => {
      console.log("course professor update error");
    })
  }
  
  function updateRegCode(crn, code = ""){
    if(code === ""){
      return -2;
    }
  
    return pool.query(`UPDATE courses SET registrationcode = $1 WHERE crn = $2`, [code, crn]).then( result => {
      console.log("successful registration code update");
    }).catch(error => {
      console.log("registration code update error"); 
    })
  }
  
  // linh changed
  async function getLogin(username, password, req, res) {
    try {
      const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
      const user = result.rows[0];
      // Verify the password
      const validPassword = await argon2.verify(user.password, password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
      req.session.user = { userid: user.usrid, username: user.username, role: user.role };
      res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.role } });
    } catch (error) {
      console.log("Error during login:", error);
      res.status(500).json({ message: 'User not found' });
    }
 }
  
  function getUsers(role = 0){
    //0: all accounts 
    //1: student accounts
    //2: professor accounts 
  
    //error trap for an account < 0 and > 2
    if(role != 0){
      pool.query(`SELECT * FROM users WHERE role = $1`, [role]).then(result => {
        console.log(result.rows);
        return result.rows;
      })
    }
    //all accounts 
    pool.query(`SELECT * FROM users`).then(result => {
      console.log(result.rows);
      return result.rows;
    })
    return;
  }
  
  function getCourse(crn){
    pool.query(`SELECT * FROM courses WHERE crn = $1`, [crn]).then(result => {
      console.log(result.rows);
      return result.rows;
    }).catch(error => {
      console.log("course not found");
    });
  }

  //add a toggle for all course information
  function getCourses(userid, req, res){
    //need to get the userid from the cookie data 
    console.log(req.session.user);
    console.log(userid);
    pool.query(`SELECT title FROM courses JOIN enrollment ON crn = coursecrn WHERE usrid = $1`, [userid]).then(result => {
      console.log(result.rows);
      return res.status(200).json({'courses': result.rows});
    }).catch(error => {
      console.log("course retrieval error");
      return res.status(500).json({message: 'Course retrieval error'});
    });
  }
  
  
  
  function unenroll(userid, crn){
    pool.query(`DELETE FROM enrollment WHERE usrid = $1 AND crn = $2`, [userid, crn]).then(result =>{
      console.log("successfully unenrolled from course");
    }).catch(error => {
      console.log("unenrollment error");
    });
  }

function testSuite(){
    //account creation 
    registerAccount("user-test", "passW0rd", 1);
    registerAccount("student", "wordpass", 1);
    registerAccount("profUser", "abcde", 2);
    registerAccount("teacher", "defoi", 2);

    //account info updates 
    updateUsername(1, "updated");
    updatePassword(3, "newpass");

    //course creation 
    addClass("CS 260", "Computer Science", "Data Structures", 3, "CEF-ABD-2");
    addClass("CS 270", "Structures of Data", "Computer Science", 4, "24-WION2");
    addClass("MATH 201", "Mathematics", "Linear Algebra", 4, "yolo");

    //course info updates 
    updateTitle("CS 270", "Mathematical Foundations");
    updateProfessor("CS 260", 3);
    updateRegCode("MATH 201", "WUH239-W");

    //retrieve accounts 
    getUsers(0);
    getUsers(1)
    getUsers(2)

    //retrieve classes 
    getCourses("Computer Science")
    getCourses("Mathematics")

    //enroll account
    //TECHNICALLY UNTESTED
    enroll(1, 'CEF-ABD-2');
    enroll(2, 'WUH239-W')

    //unenroll account 
    //UNTESTED
}

module.exports = {
  //pool
  pool,
  //users
  registerAccount,
  updateUsername,
  updatePassword,
  getLogin,
  getUsers,
  //courses
  addCourse,
  updateTitle, 
  updateProfessor,
  updateRegCode,
  getCourse,
  getCourses,
  //enrollment
  enroll,
  unenroll
};
