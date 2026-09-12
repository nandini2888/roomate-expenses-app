# 🚀 How to Start the Application

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ installed
- ✅ Maven installed (or use IDE)
- ✅ Node.js 16+ installed

## Option 1: Using Batch Files (Easiest)

### Step 1: Start Backend
Double-click: **`start-backend.bat`**

Wait for: `Started SharingIsCaringApplication in X.XXX seconds`

### Step 2: Start Frontend  
Double-click: **`start-frontend.bat`**

Browser will open at: `http://localhost:3000`

---

## Option 2: Using Command Line

### Start Backend:
```bash
cd backend
mvn spring-boot:run
```

### Start Frontend (new terminal):
```bash
cd frontend
npm install  # First time only
npm start
```

---

## Option 3: Using IDE (IntelliJ IDEA / Eclipse / VS Code)

### Backend:
1. Open `backend` folder in your IDE
2. Find `SharingIsCaringApplication.java`
3. Right-click → Run

### Frontend:
1. Open `frontend` folder
2. Run: `npm install` (first time)
3. Run: `npm start`

---

## ⚠️ If Maven is Not Found

### Install Maven:
1. Download: https://maven.apache.org/download.cgi
2. Extract to `C:\Program Files\Apache\maven`
3. Add to PATH:
   - System Properties → Environment Variables
   - Add `C:\Program Files\Apache\maven\bin` to PATH
4. Restart terminal and try again

### Or Use IDE:
- IntelliJ IDEA / Eclipse can run Spring Boot without Maven in PATH
- Just open the project and run the main class

---

## ✅ Verify It's Working

1. **Backend**: Open `http://localhost:8080/swagger-ui.html`
   - Should show API documentation

2. **Frontend**: Open `http://localhost:3000`
   - Should show login page

3. **H2 Console**: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:sharing_is_caring`
   - Username: `sa`
   - Password: (empty)

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check Java version: `java -version` (should be 17+)
- Check if port 8080 is free
- Look at error messages in console

**Frontend won't start?**
- Check Node.js: `node -version`
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is free

**Need help?** Share the error message!



