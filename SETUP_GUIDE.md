# Setup Guide for AI PitchSpot

## 🔧 Environment Setup

### 1. Create Environment File

Create a `.env.local` file in the root directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/pitchspot

# For MongoDB Atlas (uncomment and replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchspot

# Application
NODE_ENV=development

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the connection string: `mongodb://localhost:27017/pitchspot`

#### Option B: MongoDB Atlas (Recommended)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the MONGODB_URI in `.env.local`

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## 🔐 Authentication System

The authentication system is now fully integrated with bcryptjs for password hashing:

### Features:
- ✅ Password hashing with bcryptjs
- ✅ User registration with validation
- ✅ User login with password verification
- ✅ Role-based authentication (Player/Owner)
- ✅ Session management with localStorage
- ✅ Input validation with Zod schemas

### API Endpoints:

#### POST `/api/auth/register`
Register a new user:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "player",
  "phone": "0901234567"
}
```

#### POST `/api/auth/login`
Login with existing credentials:
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "player"
}
```

### Testing the Authentication:

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Try registering a new user
4. Try logging in with the registered user
5. Check that the user data is stored in localStorage

## 🌱 Database Seeding

To populate the database with sample data:

```bash
# Make a POST request to seed the database
curl -X POST http://localhost:3000/api/seed
```

This will create:
- 3 Owner accounts
- 2 Player accounts
- 9 sample fields across different cities

## 🔍 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify the MONGODB_URI in `.env.local`
   - Ensure the connection string is correct

2. **Authentication Errors**
   - Check browser console for error messages
   - Verify that the API routes are accessible
   - Ensure bcryptjs is properly installed

3. **Environment Variables**
   - Make sure `.env.local` exists in the root directory
   - Restart the development server after changing environment variables

### Debug Commands:

```bash
# Check if MongoDB is running
mongosh

# Check environment variables
echo $MONGODB_URI

# Test API endpoints
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"player"}'
```

## 📝 Next Steps

1. Set up MongoDB (local or Atlas)
2. Create `.env.local` with your MongoDB URI
3. Start the development server
4. Test registration and login
5. Seed the database with sample data
6. Explore the application features

The authentication system is now ready to use with proper password hashing using bcryptjs! 