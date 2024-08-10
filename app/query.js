/* database stuff */
const { Pool } = require('pg');
const fs = require('fs');
const { register } = require('module');

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
function registerAccount(username = "", password = "", role){
    if ((username === "") || (password === "")) {
      //error
      return -2;
    }
    pool.query(`INSERT INTO users(username, password, role) VALUES($1, $2, $3)`, [username, password, role]).then(result => {
      console.log("successful account insert");
    }).catch(error => {
      console.log("account insert error");
      return -1;
    });
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
  
  function updatePassword(userid, password){
    if ((password === "")){
      return -2;
    }
    pool.query(`UPDATE users SET password = $1 WHERE usrID = $2`, [password, userid]).then(result => {
      console.log("successful password update");
    }).catch(error => {
      console.log("password update error");
    });
  }
  
  
  function addCourse(crn = "", dept = "", title = "", profID = "", code = ""){
      if ((crn === "") || (dept === "") || (title === "") || (profID=== "") || (code === "")){
        //error
        return -2;
      }  
  
      pool.query(`INSERT INTO courses(crn, department, title, professorid, registrationcode) VALUES($1, $2, $3, $4, $5)`, [crn, dept, title, profID, code]).then(result =>{
        console.log("successful course creation");
      }).catch(error => {
        console.log("course creation error");
      });
  }
  
  function updateTitle(crn, title = ""){
    if(title === ""){
      return -2;
    }
  
    pool.query(`UPDATE courses SET title = $1 WHERE crn = $2`, [title, crn]).then( result => {
      console.log("successful course name update");
    }).catch(error => {
      console.log("course name update error");
    })
  }
  
  function updateProfessor(crn, profID =  ""){
    if(profID === ""){
      return -2;
    }
  
    pool.query(`UPDATE courses SET professorid = $1 WHERE crn = $2`, [profID, crn]).then( result => {
      console.log("successful course professor update");
    }).catch(error => {
      console.log("course professor update error");
    })
  }
  
  function updateRegCode(crn, code = ""){
    if(code === ""){
      return -2;
    }
  
    pool.query(`UPDATE courses SET registrationcode = $1 WHERE crn = $2`, [code, crn]).then( result => {
      console.log("successful registration code update");
    }).catch(error => {
      console.log("registration code update error"); 
    })
  }
  
function getUser(username) {
  return pool.query(`SELECT * FROM users WHERE username = $1`, [username])
      .then(result => {
          if (result.rows.length > 0) {
              console.log(result.rows[0]);  // Log the user data
              return result.rows[0];  // Return the first matching user
          } else {
              console.log("User not found");
              return undefined;  // Return undefined if no user is found
          }
      })
      .catch(error => {
          console.error("Error executing query", error);
          throw error;  // Re-throw the error to be handled by the calling function
      });
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

  function getCourses(department = "", profID = 0){
    if ((department === "") && (profID === 0)){
      //error
      return "parameter error";
    }
    //search by department
    if(profID === 0){
      pool.query(`SELECT * FROM courses WHERE department = $1`, [department]).then(result => {
        console.log(result.rows);
        return result.rows;
      })
    }
    //search by professor 
    else if(department === ""){
      pool.query(`SELECT * FROM courses WHERE professorID = $1`, [profID]).then(result => {
        console.log(result.rows);
        return result.rows;
      })
    }
    else {
    //search by both department and professor
      pool.query(`SELECT * FROM courses WHERE department = $1 AND professorID = $2`, [department, profID]).then(result => {
        console.log(result.rows);
        return result.rows;
      })
    }
  }
  
  function enroll(userid, regCode){
    pool.query(`SELECT crn FROM courses WHERE registrationcode = $1`, [regCode]).then(result => {
      let crn = result.rows;
      console.log("crn:" + crn);
      pool.query(`INSERT INTO enrollment(usrid, courseCRN) VALUES ($1, $2)`, [userid, crn]).then(result =>{
        console.log("sucessfully enrolled in course");
        }).catch(error => {
          console.log("course enrollment error");
        })
    }).catch(error =>{
      console.log("invalid registration code");
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
  //users
  registerAccount,
  updateUsername,
  updatePassword,
  getUser,
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