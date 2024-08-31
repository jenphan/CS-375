# Blueboard

Blueboard is an interactive online learning platform designed for both students and professors. It offers a variety of tools to enhance the learning experience, including quizzes, course materials, discussion forums, and more.

## URL to Deployed Public Site
`https://cs375blueboard.fly.dev/`

## Features
- **User Authentication**: Professors and students can create accounts and log in securely.
- **Quiz Creation and Management**: Professors can create quizzes with various question types, including multiple-choice, short answer, long answer, and image upload. Quizzes can be auto-graded or manually graded.
- **Course Management**: Professors can create courses, generate registration codes, and manage course materials.
- **Student Interaction**: Students can enroll in courses, participate in quizzes, and view grades.
- **File Upload and Download**: Supports uploading images as part of quiz answers and downloading images from the server.
- **Session Management**: Ensures secure access to various routes based on user roles (student or professor).
- **Deployment Ready**: Configured for deployment on platforms like Fly.io.

## Technology Stack
- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **Database**: PostgreSQL
- **Authentication**: Session-based using `express-session`
- **Deployment**: Configured for Fly.io deployment

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL
- Git

### Installation
1. **Clone the repository**:

   ```bash
   git clone https://github.com/jenphan/CS-375.git
   cd CS-375
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   - Create a file named `env.json` in the root directory with your PostgreSQL database configuration:
   ```json
   {
     "DATABASE_USER": "your_db_user",
     "DATABASE_HOST": "localhost",
     "DATABASE_NAME": "cs375blueboard",
     "DATABASE_PASSWORD": "your_db_password",
     "DATABASE_PORT": 5432
   }
   ```

4. **Set up the database**:
   - Run the SQL script to set up the necessary tables:

   ```bash
   psql -U your_db_user -d cs375blueboard -f setup.sql
   ```

5. **Start the server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

### Usage
- **Access the platform**: Open your browser and go to `http://localhost:3000`.
- **Navigate to different features**:
  - **Quizzes**: Professors can create quizzes, and students can take them.
  - **Courses**: Professors can manage courses, and students can enroll in them.
  - **Grades**: View grades and feedback for completed quizzes.
  - **Calendar**: Manage appointments and deadlines.

## Deployment
The project is configured for deployment on Fly.io. Ensure you have the correct environment variables and PostgreSQL configuration set up before deploying.

## Contact
We would like to extend our gratitude to Professor Galen Long and our course assistant Matt Protacio for guiding us through this project and providing valuable feedback.

For questions or support, please contact us:
- Jennifer Phan (jenphan@drexel.edu)
- Linh Nguyen (pn383@drexel.edu)
- Lam Nguyen (ltn45@drexel.edu)
- Sophia Bartolacci (slb522@drexel.edu)
- Mackenzie Ligon (mal483@drexel.edu)
