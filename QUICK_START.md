# Quick Start Guide

## Prerequisites Check
- ✅ Java 17+ installed (`java -version`)
- ✅ Maven installed (`mvn -version`)
- ✅ Node.js 16+ installed (`node -version`)
- ✅ MySQL running on port 3306
- ✅ Database `sharing_is_caring` created (or will be auto-created)

## Step-by-Step Startup

### 1. Start MySQL Database
Make sure MySQL is running and accessible with:
- Username: `root`
- Password: `123456` (as configured in application.properties)

### 2. Start Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started SharingIsCaringApplication in X.XXX seconds`

### 3. Start Frontend (Terminal 2)
```bash
cd frontend
npm install  # Only needed first time
npm start
```

Wait for browser to open at `http://localhost:3000`

## Verify Everything Works

1. **Backend Health**: Open `http://localhost:8080/swagger-ui.html`
   - You should see the API documentation

2. **Frontend**: Open `http://localhost:3000`
   - You should see the login page

3. **Test Flow**:
   - Register a new account
   - Create a room
   - Add an expense
   - View dashboard

## Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p123456`
- Verify database exists or can be created
- Check port 8080 is not in use
- Look at console for error messages

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check port 3000 is not in use
- Verify `REACT_APP_API_URL` in `.env` (optional)

### Database Connection Error
- Verify MySQL credentials in `backend/src/main/resources/application.properties`
- Ensure MySQL service is running
- Check firewall settings

## Your Configuration
- Database Password: `123456` (as you set it)
- Backend Port: `8080`
- Frontend Port: `3000`
- Database: `sharing_is_caring` (auto-created)

