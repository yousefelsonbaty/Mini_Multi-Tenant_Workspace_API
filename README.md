# Mini Multi-Tenant Workspace API

A RESTful API for lightweight workspace & task management system built with Node.js, Express, and SQLite.

## 📋 Track Chosen

**Track 1: Backend API Engineer:**

## ✨ Features

- **User Management**: Create and retrieve users
- **Workspace Management**: Create workspaces and manage workspace members
- **Task Management**: Create tasks, filter by workspace, and mark tasks as complete
- **Summary Statistics**: Get comprehensive overview of users, workspaces, and task completion rates
- **Multi-Tenant Architecture**: Support for multiple workspaces with isolated task management
- **Data Persistence**: SQLite database with proper relationships and foreign key constraints

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (sqlite3)
- **Architecture**: MVC (Models, Routes, Controllers)
- **Environment Management**: dotenv

## 📁 Project Structure

```text
Mini Multi-Tenant Workspace API/
├── models/
│   ├── database.js       # Database initialization and schema
│   ├── User.js           # User model
│   ├── Workspace.js      # Workspace model
│   └── Task.js           # Task model
├── controllers/
│   ├── userController.js       # User business logic
│   ├── workspaceController.js  # Workspace business logic
│   ├── taskController.js       # Task business logic
│   └── summaryController.js    # Summary statistics logic
├── routes/
│   ├── users.js          # User routes
│   ├── workspaces.js     # Workspace routes
│   ├── tasks.js          # Task routes
│   └── summary.js        # Summary routes
├── server.js             # Main application entry point
├── seed.js               # Database seeding script
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🚀 Setup and Run Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or extract the project**

   ```bash
   cd "Mini Multi-Tenant Workspace API"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if needed (default PORT is 3000)

4. **Seed the database** (optional but recommended)

   ```bash
   npm run seed
   ```

   This will create:
   - 4 sample users
   - 3 workspaces
   - 11 tasks (3 completed, 8 pending)
   - User-workspace relationships

5. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

6. **Access the API**
   - Base URL: `http://localhost:3000`
   - API documentation is available at the root endpoint

## 📡 API Endpoints

### Users

#### Create User

```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Get All Users

```http
GET /users
```

### Workspaces

#### Create Workspace

```http
POST /workspaces
Content-Type: application/json

{
  "name": "Engineering Team",
  "description": "Workspace for engineering projects"
}
```

#### Get All Workspaces

```http
GET /workspaces
```

#### Add User to Workspace

```http
POST /workspaces/{id}/users
Content-Type: application/json

{
  "userId": 1,
  "role": "member"
}
```

### Tasks

#### Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "Implement authentication",
  "description": "Add JWT-based authentication",
  "workspaceId": 1,
  "assignedTo": 2
}
```

#### Get Tasks (with optional filter)

```http
GET /tasks
GET /tasks?workspaceId=1
```

#### Mark Task as Complete

```http
PATCH /tasks/{id}
```

### Summary

#### Get Overall Summary

```http
GET /summary
```

Returns statistics including:

- Total users
- Total workspaces with user counts
- Task statistics (total, completed, pending, completion rate)

## 🧪 Testing the API

You can test the API using:

### cURL Examples

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'

# Get all users
curl http://localhost:3000/users

# Create a workspace
curl -X POST http://localhost:3000/workspaces \
  -H "Content-Type: application/json" \
  -d '{"name":"Sales Team","description":"Sales workspace"}'

# Add user to workspace
curl -X POST http://localhost:3000/workspaces/1/users \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"role":"admin"}'

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Review docs","workspaceId":1,"assignedTo":1}'

# Get tasks by workspace
curl http://localhost:3000/tasks?workspaceId=1

# Mark task as complete
curl -X PATCH http://localhost:3000/tasks/1

# Get summary
curl http://localhost:3000/summary
```

### Using Postman or Thunder Client

Import the following endpoints into your API client:

- Base URL: `http://localhost:3000`
- Use the endpoint documentation above

## 🔍 Features Implemented

### ✅ Core Requirements

- [x] POST /users - Create new user
- [x] GET /users - Retrieve all users
- [x] POST /workspaces - Create new workspace
- [x] GET /workspaces - Retrieve all workspaces
- [x] POST /workspaces/{id}/users - Add user to workspace
- [x] POST /tasks - Create new task
- [x] GET /tasks?workspaceId= - Retrieve tasks with optional workspace filter
- [x] PATCH /tasks/{id} - Mark task as complete
- [x] GET /summary - Get comprehensive summary statistics

### ✅ Additional Features

- Input validation for all endpoints
- Error handling with appropriate HTTP status codes
- Proper database relationships with foreign keys
- Multi-tenant support (workspace isolation)
- User-workspace many-to-many relationships
- Task assignment to users
- Database seeding script for testing
- Structured response format (success, data, error fields)
- Request logging middleware
- Comprehensive API documentation

## 🗄 Database Schema

### Users Table

- id (PRIMARY KEY)
- name
- email (UNIQUE)
- created_at

### Workspaces Table

- id (PRIMARY KEY)
- name
- description
- created_at

### Workspace_Users Table (Join Table)

- id (PRIMARY KEY)
- workspace_id (FOREIGN KEY)
- user_id (FOREIGN KEY)
- role
- added_at

### Tasks Table

- id (PRIMARY KEY)
- title
- description
- workspace_id (FOREIGN KEY)
- assigned_to (FOREIGN KEY to users)
- status
- completed (BOOLEAN)
- created_at
- updated_at

## 🎯 Design Decisions

1. **SQLite over JSON**: Chosen for better data integrity, relationships, and query capabilities
2. **MVC Architecture**: Clear separation of concerns with models, routes, and controllers
3. **Foreign Key Constraints**: Ensures data integrity and proper cascading
4. **Separate Join Table**: Enables many-to-many relationships between users and workspaces
5. **Status Tracking**: Both `status` field and `completed` boolean for flexibility
6. **Comprehensive Validation**: Input validation at controller level before database operations
7. **Structured Responses**: Consistent JSON response format across all endpoints

## 🐛 Error Handling

The API handles various error scenarios:

- 400: Bad Request (missing required fields, invalid data)
- 404: Not Found (resource doesn't exist)
- 409: Conflict (duplicate email, user already in workspace)
- 500: Internal Server Error

## 📝 Notes

- The database file (`workspace.db`) is automatically created on first run
- Running `npm run seed` will add sample data to the database
- The API uses SQLite's in-process database (no separate database server needed)
- All timestamps are automatically managed by SQLite

## 👨‍💻 Development

For development with auto-reload:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## 🔮 Future Enhancements

Potential improvements for production:

- User authentication and authorization (JWT)
- Task due dates and priorities
- Task comments and attachments
- Workspace permissions (read/write/admin)
- Pagination for large datasets
- Task filtering by status, assignee, date range
- WebSocket support for real-time updates
- API rate limiting
- Comprehensive unit and integration tests
- Docker containerization
- API versioning

## 📄 License

[MIT](LICENSE)

---

Developed as part of Backend API Engineer assessment
