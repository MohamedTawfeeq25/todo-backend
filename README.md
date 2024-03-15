# Todo Backend API

Welcome to the Todo Backend API repository! This project provides a robust backend API for managing tasks in a todo application. It's built using Node.js, Express.js, and MySQL, offering secure authentication and authorization mechanisms.

## Features
- **Authentication and Authorization**: Secure JWT-based authentication ensures only authorized users can access the API endpoints.
- **Task Management**: Comprehensive task management features including creation, retrieval, updating, and deletion of tasks.
- **Encryption**: Utilizes bcrypt for encryption, ensuring sensitive user data remains secure.
- **Database Integration**: Utilizes MySQL for efficient data storage and retrieval, with automatic database creation capabilities.

## Technologies Used
- **Node.js**: A powerful JavaScript runtime for building scalable server-side applications.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **MySQL**: An open-source relational database management system.
- **JWT**: JSON Web Tokens for secure authentication and authorization.
- **bcrypt**: A cryptographic library for hashing passwords.


## Setup and Installation

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file in the root directory of the project.
4. Add the following environment variables to the `.env` file:
  - password=database password
  - SECRET_KEY=secret key for jwt
5. Run the database initialization script using `node db.js`.
6. Run the server using `node server.js`.

## Usage

1. **Authentication**:
   - Use the `/to-do/auth/register` endpoint to register user and obtain a JWT token for authentication.
   - - Use the `/to-do/auth/login` endpoint  obtain a JWT token for authentication.
   - Include the token in the Authorization header for subsequent requests.

2. **Task Management**:
   - Utilize the various endpoints provided for tasks management:
   - -`/to-do/auth/changePassword`:PUT
     - `/to-do/task/retrieve/`: GET
     - `/to-do/task/retrieve/:id`: GET
     - `/to-do/task/completed`: GET
     - `/to-do/task/Notcompleted`: GET
     - `/tasks/:id/complete`: PUT

## Contribution

Contributions are welcomed! Whether it's bug fixes, feature enhancements, or documentation improvements, your contributions are highly appreciated. To contribute, simply fork this repository, make your changes, and submit a pull request.
