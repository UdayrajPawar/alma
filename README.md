# Alumni Connect Platform

A comprehensive MERN stack application for alumni networking, featuring user profiles, connections, posts, events, jobs, messaging, and more.

## Features

- **User Authentication**: Register, login, password reset with JWT tokens
- **User Profiles**: Complete profiles with education, skills, work experience
- **Connections**: Send/accept connection requests, build your network
- **Posts & Timeline**: Create posts with images, like, comment
- **Events**: Create and RSVP to events
- **Jobs**: Post and apply for job opportunities
- **Messaging**: Real-time 1-on-1 messaging with Socket.io
- **Notifications**: Real-time notifications for connections, messages, likes, etc.
- **Institutes**: Institute pages with verification
- **Admin Panel**: Platform and institute admin capabilities
- **Search**: Search users, institutes, jobs, and events

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io for real-time features
- JWT authentication
- AWS S3 for file storage
- Bcrypt for password hashing

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Socket.io client for real-time features
- Axios for API calls
- Context API for state management

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- AWS S3 account (for file uploads)
- Docker (optional, for containerized deployment)

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/alumni-connect
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FRONTEND_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET=alumni-connect-uploads
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Docker Deployment

1. Update environment variables in `docker-compose.yml`

2. Build and start containers:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/search` - Search users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/connect` - Send connection request
- `POST /api/users/:id/connect/accept` - Accept connection
- `DELETE /api/users/:id/connect` - Remove connection

### Posts
- `GET /api/posts` - Get posts (feed/user/institute)
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `GET /api/posts/:id/comments` - Get comments

### Events
- `GET /api/events` - Get events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/rsvp` - RSVP to event

### Jobs
- `GET /api/jobs` - Get jobs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply for job

### Messages
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Create/get conversation
- `GET /api/messages/:id/messages` - Get messages
- `POST /api/messages/:id/messages` - Send message

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read

### Institutes
- `GET /api/institutes` - Get institutes
- `POST /api/institutes` - Create institute
- `GET /api/institutes/:id` - Get institute details

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `POST /api/admin/institutes/:id/verify` - Verify institute
- `POST /api/admin/users/verify` - Verify user

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
alumni-connect-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── postController.js
│   │   ├── eventController.js
│   │   ├── jobController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── instituteController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Institute.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Event.js
│   │   ├── Job.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── events.js
│   │   ├── jobs.js
│   │   ├── messages.js
│   │   ├── notifications.js
│   │   ├── institutes.js
│   │   └── admin.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── s3.js
│   ├── tests/
│   │   └── auth.test.js
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── EventCard.jsx
│   │   │   └── JobCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Events.jsx
│   │   │   └── Jobs.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .github/workflows/
│   └── ci.yml
└── README.md
```

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT access tokens
- `JWT_REFRESH_SECRET` - Secret for JWT refresh tokens
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET` - S3 bucket name
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Deployment

### Backend (Heroku/Render/DigitalOcean)
1. Set environment variables
2. Deploy using Git or Docker
3. Ensure MongoDB Atlas connection

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` environment variable
2. Deploy using Git integration
3. Update CORS settings in backend

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens with refresh token rotation
- Rate limiting on sensitive endpoints
- File upload validation and size limits
- CORS configuration
- Helmet.js for security headers
- Input validation and sanitization

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub.

