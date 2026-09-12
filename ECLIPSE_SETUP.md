# 🚀 Running the Application in Eclipse

## Step 1: Import Backend Project into Eclipse

1. **Open Eclipse**
2. **File → Import**
3. Select: **Existing Maven Projects**
4. Browse to: `C:\Users\medid\OneDrive\Desktop\SplittingExpenses\backend`
5. Click **Finish**
   - Eclipse will automatically download Maven dependencies (first time may take a few minutes)

## Step 2: Run Spring Boot Backend

1. In Eclipse, find: `SharingIsCaringApplication.java`
   - Path: `backend/src/main/java/com/sharingiscaring/SharingIsCaringApplication.java`
2. **Right-click** on the file
3. Select: **Run As → Java Application**
4. Wait for console message: `Started SharingIsCaringApplication in X.XXX seconds`
5. ✅ Backend is running on `http://localhost:8080`

## Step 3: Start Frontend (Terminal/Command Prompt)

Since frontend is React, you need to run it separately:

1. **Open Command Prompt or PowerShell**
2. Navigate to frontend:
   ```bash
   cd C:\Users\medid\OneDrive\Desktop\SplittingExpenses\frontend
   ```
3. **Install dependencies** (first time only):
   ```bash
   npm install
   ```
4. **Start frontend**:
   ```bash
   npm start
   ```
5. Browser will open at `http://localhost:3000`

## ✅ Verify Everything Works

1. **Backend API**: Open `http://localhost:8080/swagger-ui.html`
   - Should show API documentation

2. **Frontend**: Should open automatically at `http://localhost:3000`
   - You'll see the login page

3. **H2 Console**: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:sharing_is_caring`
   - Username: `sa`
   - Password: (leave empty)

## 🎯 Quick Test

1. Register a new account
2. Create a room
3. Add an expense
4. View dashboard

## 🆘 Troubleshooting

**Eclipse can't find Maven?**
- Eclipse should have Maven built-in
- If not: Help → Eclipse Marketplace → Search "Maven" → Install

**Backend won't start?**
- Check Console tab for errors
- Make sure Java 17+ is configured in Eclipse
- Window → Preferences → Java → Installed JREs

**Frontend npm errors?**
- Make sure Node.js is installed: `node -version`
- Delete `node_modules` folder and run `npm install` again

---

## 📝 Summary

- **Backend**: Run in Eclipse (Right-click → Run As → Java Application)
- **Frontend**: Run in terminal (`npm start`)

Both need to run simultaneously!



