/* database stuff */
const pg = require("pg");
const env = require("./env.json");
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
  console.log(`Connected to database ${env.database}`);
});

/* QUERY FUNCTIONS */
function registerAccount(username = "", password = "", type) {
  if (username === "" || password === "") {
    //error
    return -2;
  }
  pool
    .query(
      `INSERT INTO accounts(username, password, type) VALUES($1, $2, $3)`,
      [username, password, type],
    )
    .then((result) => {
      console.log("successful account insert");
    })
    .catch((error) => {
      console.log("account insert error");
    });
}

function updateUsername(userid, username) {
  if (username === "") {
    return -2;
  }
  pool
    .query(`UPDATE accounts SET username = $1 WHERE accounts_id = $2`, [
      username,
      userid,
    ])
    .then((result) => {
      console.log("successful username update");
    })
    .catch((error) => {
      console.log("username update error");
    });
}

function updatePassword(userid, password) {
  if (password === "") {
    return -2;
  }
  pool
    .query(`UPDATE accounts SET password = $1 WHERE accounts_id = $2`, [
      password,
      userid,
    ])
    .then((result) => {
      console.log("successful password update");
    })
    .catch((error) => {
      console.log("password update error");
    });
}

function addCourse(crn = "", name = "", subject = "", number = "", code = "", profID = "") {
  if (
    crn === "" ||
    name === "" ||
    subject === "" ||
    number === "" ||
    code === "" ||
    profID === ""
  ) {
    //error
    return -2;
  }

  pool
    .query(
      `INSERT INTO courses(crn, course_name, subject_code, course_number, reg_code) VALUES($1, $2, $3, $4, $5, $6)`,
      [crn, name, subject, number, code, profID],
    )
    .then((result) => {
      console.log("successful course creation");
    })
    .catch((error) => {
      console.log("course creation error");
    });
}

function updateTitle(crn, courseName = "") {
  if (courseName === "") {
    return -2;
  }

  pool
    .query(`UPDATE courses SET course_name = $1 WHERE crn = $2`, [courseName, crn])
    .then((result) => {
      console.log("Successfully updated course name.");
    })
    .catch((error) => {
      console.log("Course name failed to update.");
    });
}

function updateProfessor(crn, profID = "") {
  if (profID === "") {
    return -2;
  }

  pool
    .query(`UPDATE courses SET professorID = $1 WHERE crn = $2`, [profID, crn])
    .then((result) => {
      console.log("Professor ID successfully updated.");
    })
    .catch((error) => {
      console.log("Professor ID failed to update.");
    });
}

function updateRegCode(crn, code = "") {
  if (code === "") {
    return -2;
  }

  pool
    .query(`UPDATE courses SET reg_code = $1 WHERE crn = $2`, [
      code,
      crn,
    ])
    .then((result) => {
      console.log("successful registration code update");
    })
    .catch((error) => {
      console.log("registration code update error");
    });
}

function getAccounts(type = 0) {
  //0: all accounts
  //1: student accounts
  //2: professor accounts

  //error trap for an account < 0 and > 2
  if (type != 0) {
    pool
      .query(`SELECT * FROM accounts WHERE type = $1`, [type])
      .then((result) => {
        console.log(result.rows);
        return result.rows;
      });
  }
  //all accounts
  pool.query(`SELECT * FROM accounts`).then((result) => {
    console.log(result.rows);
    return result.rows;
  });
  return;
}

function getClasses(department = "", profID = 0) {
  if (department === "" && profID === 0) {
    //error
    return "parameter error";
  }
  //search by department
  if (profID === 0) {
    pool
      .query(`SELECT * FROM courses WHERE department = $1`, [department])
      .then((result) => {
        console.log(result.rows);
        return result.rows;
      });
  }
  //search by professor
  else if (department === "") {
    pool
      .query(`SELECT * FROM courses WHERE professorID = $1`, [profID])
      .then((result) => {
        console.log(result.rows);
        return result.rows;
      });
  } else {
    //search by both department and professor
    pool
      .query(
        `SELECT * FROM courses WHERE department = $1 AND professorID = $2`,
        [department, profID],
      )
      .then((result) => {
        console.log(result.rows);
        return result.rows;
      });
  }
}

function enroll(userid, regCode) {
  pool
    .query(`SELECT crn FROM courses WHERE reg_code = $1`, [regCode])
    .then((result) => {
      let crn = result.rows;
      console.log("crn:" + crn);
      pool
        .query(`INSERT INTO enrollment(accounts_id, courseCRN) VALUES ($1, $2)`, [
          userid,
          crn,
        ])
        .then((result) => {
          console.log("sucessfully enrolled in course");
        })
        .catch((error) => {
          console.log("course enrollment error");
        });
    })
    .catch((error) => {
      console.log("invalid registration code");
    });
}

function unenroll(userid, crn) {
  pool
    .query(`DELETE FROM enrollment WHERE accounts_id = $1 AND crn = $2`, [
      userid,
      crn,
    ])
    .then((result) => {
      console.log("successfully unenrolled from course");
    })
    .catch((error) => {
      console.log("unenrollment error");
    });
}

function testSuite() {
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
  getAccounts(0);
  getAccounts(1);
  getAccounts(2);

  //retrieve classes
  getClasses("Computer Science");
  getClasses("Mathematics");

  //enroll account
  //TECHNICALLY UNTESTED
  enroll(1, "CEF-ABD-2");
  enroll(2, "WUH239-W");

  //unenroll account
  //UNTESTED
}
