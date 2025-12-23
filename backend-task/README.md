# Sciqus Backend Task

A professional Node.js backend API built with Express, PostgreSQL, and enterprise-grade security practices following Clean Architecture / MVC pattern.

## Features

- ✅ Express.js REST API
- ✅ PostgreSQL database integration
- ✅ JWT authentication ready
- ✅ Security best practices (Helmet, CORS)
- ✅ Request validation with Zod
- ✅ Standardized API responses
- ✅ Environment-based configuration
- ✅ Logging with Morgan
- ✅ Password hashing with bcryptjs

## Project Structure

```
sciqus-backend-task/
├── src/
│   ├── config/             # Database connection & Env config
│   ├── controllers/        # Request handling logic
│   ├── middleware/         # Auth (JWT) & Error handling
│   ├── models/             # Schema definitions (if using ORM) or SQL Types
│   ├── routes/             # API endpoint definitions
│   ├── services/           # Business logic & Database interactions
│   ├── sql/                # .sql files (Tables, Procedures, Seed Data)
│   ├── utils/              # Helper functions (Response formatters)
│   └── app.js              # Entry point
├── .env.example            # Environment variable templates
├── .gitignore
├── package.json
└── README.md               # Professional Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Database credentials
   - JWT secrets
   - Allowed origins
   - Other environment-specific settings

### Running the Application

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true|false,
  "data": {...},
  "message": "Descriptive message"
}
```

### Response Handler Methods

- `ResponseHandler.success(res, data, message, statusCode)` - Success responses
- `ResponseHandler.error(res, message, statusCode, data)` - Error responses
- `ResponseHandler.validationError(res, errors, message)` - Validation errors (400)
- `ResponseHandler.notFound(res, message)` - Not found (404)
- `ResponseHandler.unauthorized(res, message)` - Unauthorized (401)
- `ResponseHandler.forbidden(res, message)` - Forbidden (403)

## Available Scripts

- `npm start` - Run the application in production mode
- `npm run dev` - Run the application in development mode with nodemon
- `npm test` - Run tests (to be implemented)

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **JWT**: Token-based authentication ready
- **bcryptjs**: Password hashing
- **Input Validation**: Using Zod schemas
- **Rate Limiting**: Ready for implementation

## Health Check

Check if the service is running:
```
GET /health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-12-23T..."
  },
  "message": "Service is running"
}
```

## Development Guidelines

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create service in `src/services/`
3. Define routes in `src/routes/`
4. Import routes in `src/app.js`

### Database Integration

1. Configure database connection in `src/config/`
2. Create SQL schema files in `src/sql/`
3. Define models in `src/models/`
4. Implement database interactions in `src/services/`

### Middleware

- Authentication: Implement JWT verification in `src/middleware/`
- Error handling: Already configured globally in `app.js`
- Custom middleware: Add to `src/middleware/`

## License

ISC
