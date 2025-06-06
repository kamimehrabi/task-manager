# Task Manager Backend

A robust Node.js backend for the Task Manager application, built with Express.js, TypeScript, and MongoDB.

## Features

- User authentication (signup and login)
- JWT-based authorization
- Task CRUD operations
- Input validation using Joi
- Error handling middleware
- MongoDB integration
- TypeScript support
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)
- Yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `config.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb://db/task-manager
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=90d
```

## Running the Application

### Development Mode

```bash
yarn start
```

### Production Mode

```bash
NODE_ENV=production yarn start
```

## API Endpoints

### Authentication

#### Sign Up

- **POST** `/api/v1/users/signup`
- **Body**:
    ```json
    {
        "name": "string",
        "email": "string",
        "password": "string",
        "passwordConfirm": "string"
    }
    ```

#### Login

- **POST** `/api/v1/users/login`
- **Body**:
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```

### Tasks

#### Get All Tasks

- **GET** `/api/v1/tasks`
- **Headers**: `Authorization: Bearer <token>`

#### Create Task

- **POST** `/api/v1/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
    ```json
    {
      "title": "string (min 10 chars)",
      "description": "string",
      "status": "pending" | "in-progress" | "done"
    }
    ```

#### Update Task

- **PUT** `/api/v1/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Same as Create Task

#### Delete Task

- **DELETE** `/api/v1/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`

## Validation Rules

### User

- Name: Required
- Email: Required, valid email format
- Password: Required, minimum 8 characters
- Password Confirm: Must match password

### Task

- Title: Required, minimum 10 characters
- Description: Required
- Status: Required, must be one of: "pending", "in-progress", "done"

## Error Handling

The API uses a global error handling middleware that returns errors in the following format:

```json
{
  "status": "error" | "fail",
  "message": "Error message"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS enabled for frontend integration
- Input validation and sanitization
- Error messages don't expose sensitive information

## Project Structure

```
src/
├── controllers/     # Request handlers
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
├── validators/     # Input validation schemas
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## Development

### Available Scripts

- `yarn start`: Start the development server
- `yarn test`: Run tests (not implemented yet)

### Code Style

The project uses ESLint with Airbnb configuration and Prettier for code formatting.

## Docker Support

The application includes Docker configuration for easy deployment:

```bash
docker-compose up
```

This will start both the MongoDB and Node.js containers.

## License

This project is licensed under the MIT License.
