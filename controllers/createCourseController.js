
let {addCourse} = require('../app/query');

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createCourse = async (req, res) => {
    const { courseName, subjectCode, courseNumber, crn} = req.body;
    console.log(req.body);
    console.log(req.session.user);

    if (!courseName || !subjectCode || !courseNumber || !crn) {
        return res.status(400).json({ message: 'All fields are required' });
    }


    addCourse(crn, subjectCode, courseNumber, courseName, req.session.user.userid, generateRandomCode(), req, res);

};

module.exports = { createCourse };
