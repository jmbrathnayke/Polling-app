# Authentication Routes Testing

## Available Routes

### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Request Password Reset
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### 4. Confirm Password Reset
```
PUT /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### 5. Update Profile (Protected)
```
PUT /api/auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

### 6. Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <token>
```

## Environment Variables Required

Create a `.env` file in the backend directory with:

```
MONGO_URI=mongodb://localhost:27017/polling-app
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=30d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
PORT=5000
```

## Usage Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Notes

- All passwords are automatically hashed using bcryptjs
- JWT tokens expire in 30 days by default
- Password reset tokens expire in 10 minutes
- Email service requires Gmail app password for nodemailer
- All protected routes require Authorization header with Bearer token
