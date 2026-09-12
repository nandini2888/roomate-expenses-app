# Sharing is Caring

A full-stack web application for managing shared apartment expenses among roommates. Track expenses, split bills, upload receipts, and calculate settlements automatically.

---

## 🚀 Features

- **User Authentication**: JWT-based secure authentication with role-based access control (`ADMIN`, `MEMBER`).
- **Room Management**: Create shared rooms, join via unique 6-character room codes, and manage room members.
- **Expense Tracking**: Add, edit, and delete expenses with amount, category, date, payer, and description.
- **Smart Splitting**: Support for both **Equal Split** across all room members and **Custom Split** with per-member allocations and sum validation.
- **Bill & Receipt Upload**: Attach receipt images or documents to expenses, with in-browser image preview and modal viewer.
- **Monthly Financial Summary**: Comprehensive spending breakdown by category and by room member.
- **Settlement Calculator**: Automated calculation of member balances and optimized repayment suggestions (*"who owes whom how much"*).
- **Interactive Dashboard**: Overview metrics (Total Expenses, Per Person Share, Total Members), Recharts category pie charts, member bar charts, and balance tables.
- **Responsive UI**: Clean, responsive user interface styled with Tailwind CSS.

---

## 🛠️ Tech Stack

### Backend
- **Language & Runtime**: Java 17
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security 6 with JWT (io.jsonwebtoken 0.12.3) and BCrypt password hashing
- **Data Access**: Spring Data JPA / Hibernate
- **Database**:
  - **H2 Database** (Default in-memory database for immediate development/testing)
  - **MySQL 8** (Optional persistent database)
- **API Documentation**: SpringDoc OpenAPI / Swagger UI 2.3.0

### Frontend
- **Library**: React 18.2.0
- **Routing**: React Router DOM 6.20.1
- **HTTP Client**: Axios 1.6.2 (with JWT interceptor)
- **Styling**: Tailwind CSS 3.3.6
- **Data Visualization**: Recharts 2.10.3

---

## 📁 Project Structure

```text
roommate-expense-app/
├── backend/                             # Spring Boot Backend API
│   ├── src/main/java/com/sharingiscaring/
│   │   ├── config/                      # Security & Swagger configurations
│   │   ├── controller/                  # REST API Controllers
│   │   ├── dto/                         # Request and Response DTOs
│   │   ├── exception/                   # Global exception handling
│   │   ├── model/                       # JPA Entities (User, Room, Expense, Bill, etc.)
│   │   ├── repository/                  # Spring Data JPA Repositories
│   │   ├── security/                    # JWT Filter, Token Provider, UserDetails
│   │   └── service/                     # Core business & settlement logic
│   ├── src/main/resources/
│   │   └── application.properties       # Server & database configuration (H2 / MySQL)
│   └── pom.xml                          # Maven build configuration
├── frontend/                            # React Frontend Application
│   ├── public/                          # Static assets and index.html
│   ├── src/
│   │   ├── components/                  # Navbar, PrivateRoute
│   │   ├── context/                     # AuthContext (state & session management)
│   │   ├── pages/                       # Dashboard, Rooms, Expenses, Summary, Login, Register
│   │   ├── utils/                       # Axios API client with token interceptors
│   │   ├── App.js                       # Main router configuration
│   │   └── index.js                     # React entry point
│   ├── package.json                     # Frontend dependencies and scripts
│   └── tailwind.config.js               # Tailwind CSS styling configuration
├── docs/                                # Project Specifications & Documentation
│   ├── BRD.md                           # Business Requirements Document
│   ├── SPRINT_PLAN.md                   # Agile sprint plan & team roles
│   ├── TDD.md                           # Technical Design Document
│   └── USER_STORIES.md                  # User stories and acceptance criteria
├── uploads/bills/                       # Local storage directory for receipt files
├── start-backend.bat                    # Batch script to start Spring Boot backend
├── start-frontend.bat                   # Batch script to start React frontend
├── diagnose.bat                         # Diagnostic tool for database connection checks
└── README.md                            # Main project documentation
```

---

## 🗄️ Database Configuration

### 1. Default: H2 In-Memory Database
The application is preconfigured to run with **H2 In-Memory Database** out of the box. No external database installation or setup is required.

- **JDBC URL**: `jdbc:h2:mem:sharing_is_caring`
- **Driver Class**: `org.h2.Driver`
- **Username**: `sa`
- **Password**: *(leave blank)*
- **H2 Web Console**: Accessible at `http://localhost:8080/h2-console` when the backend is running.
- **Note**: Data persists in memory while the backend is running and resets when stopped.

### 2. Optional: MySQL Database Configuration
If you wish to switch to MySQL for persistent data:

1. In `backend/pom.xml`:
   - Uncomment the `mysql-connector-java` dependency block.
   - (Optional) Comment out the `h2` dependency block.
2. In `backend/src/main/resources/application.properties`:
   - Comment out the H2 configuration lines (lines 6–21).
   - Uncomment the MySQL configuration block:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/sharing_is_caring?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
     spring.datasource.username=root
     spring.datasource.password=YOUR_MYSQL_PASSWORD
     spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
     spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
     ```
3. Restart the backend application.

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher (`java -version`)
- **Maven**: 3.6+ or bundled IDE Maven (`mvn -version`)
- **Node.js**: v16 or higher (`node -version`)
- **npm**: v8 or higher (`npm -version`)

---

### Startup Option A: Using Helper Batch Scripts (Windows)

1. **Start Backend**: Double-click `start-backend.bat` (or execute it in a terminal).
2. **Start Frontend**: Double-click `start-frontend.bat` (or execute it in a terminal).

---

### Startup Option B: Using the Command Line

#### 1. Start the Backend Server
In a terminal window:
```bash
cd backend
mvn spring-boot:run
```
The backend starts on port **8080**. Wait for the console log:
`Started SharingIsCaringApplication in X.XXX seconds`

#### 2. Start the Frontend Application
In a separate terminal window:
```bash
cd frontend
npm install   # Required only on the first run
npm start
```
The React development server starts on port **3000** and opens automatically at `http://localhost:3000`.

---

## ✅ Verification & Service URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Application** | `http://localhost:3000` | Web UI (Login, Dashboard, Rooms, Expenses, Summary) |
| **Backend REST API** | `http://localhost:8080/api` | API Base URL |
| **Swagger / OpenAPI UI** | `http://localhost:8080/swagger-ui.html` | Interactive API documentation and testing |
| **H2 Database Console** | `http://localhost:8080/h2-console` | In-memory database browser (`jdbc:h2:mem:sharing_is_caring`) |

---

## 🔐 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Authenticate user and receive JWT token
- `GET /api/auth/me` - Retrieve current authenticated user profile

### Rooms (`/api/rooms`)
- `POST /api/rooms` - Create a new room (generates unique join code)
- `POST /api/rooms/join` - Join an existing room via join code
- `GET /api/rooms` - Get all rooms the current user belongs to
- `GET /api/rooms/{id}` - Get details of a specific room
- `GET /api/rooms/{id}/members` - Get list of members in a room
- `DELETE /api/rooms/{roomId}/members/{memberId}` - Remove a member from a room

### Expenses (`/api/expenses`)
- `POST /api/expenses` - Create an expense (Equal or Custom split)
- `GET /api/expenses?roomId={id}` - Get paginated expenses for a room
- `GET /api/expenses/month?roomId={id}&year={y}&month={m}` - Get expenses filtered by month
- `GET /api/expenses/{id}` - Get details of a specific expense
- `PUT /api/expenses/{id}` - Update an existing expense
- `DELETE /api/expenses/{id}` - Delete an expense

### Bills & Receipts (`/api/bills`)
- `POST /api/bills/upload` - Upload receipt image or document for an expense
- `GET /api/bills/{expenseId}` - Retrieve receipt image (inline display)
- `DELETE /api/bills/{expenseId}` - Delete receipt attached to an expense

### Monthly Summary & Settlements (`/api/summary`)
- `GET /api/summary/{roomId}?year={y}&month={m}` - Get monthly financial breakdown, member balances, and settlement suggestions

### Categories (`/api/categories`)
- `GET /api/categories` - Get all available expense categories

---

## 🎯 Application Workflow

1. **Register / Login**: Create a personal user account and sign in.
2. **Create or Join a Room**: Create a new shared room or join a roommate's room using the 6-character room code.
3. **Add Shared Expenses**: Record an expense with amount, category, date, payer, and description.
4. **Choose Split Type**:
   - **Equal Split**: Evenly divided among all room members automatically.
   - **Custom Split**: Allocate specific dollar amounts per member.
5. **Upload Receipts**: Attach receipt images to verify expenses.
6. **Track Balances & Settle**: View member balances on the Dashboard or Summary page and follow settlement suggestions (*who pays whom*) to square up balances.

---

## 🔒 Security & Architecture Details

- **Stateless Authentication**: Requests to protected endpoints require `Authorization: Bearer <JWT_TOKEN>`.
- **Password Protection**: Passwords hashed using Spring Security's BCrypt password encoder.
- **CORS Configuration**: Explicitly permits requests from the React frontend origin (`http://localhost:3000`).
- **Input Validation**: Backend DTOs validated using `jakarta.validation` annotations (`@Valid`, `@NotBlank`, `@NotNull`, etc.).

---

## 📝 Project Notes

- **Receipt Storage**: Uploaded bills are saved locally in the `./uploads/bills` directory.
- **Default Categories**: Standard categories (Rent, Groceries, Utilities, Internet, Food, Other) are preloaded on application startup.
- **Production Readiness**: For production environments, remember to set a secure `jwt.secret` and configure a persistent MySQL database in `application.properties`.
- **Project Specifications**: Detailed functional specifications, technical design, user stories, and sprint schedules are available in the [`docs/`](docs/) directory:
  - [Business Requirements Document (BRD)](docs/BRD.md)
  - [Technical Design Document (TDD)](docs/TDD.md)
  - [User Stories](docs/USER_STORIES.md)
  - [Sprint Plan](docs/SPRINT_PLAN.md)
