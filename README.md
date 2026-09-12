# Sharing is Caring

A full-stack web application for managing shared apartment expenses among roommates. Track expenses, split bills, upload receipts, and calculate settlements automatically.

## 🚀 Features

- **User Authentication**: JWT-based secure authentication with role-based access
- **Room Management**: Create rooms, join via code, manage members
- **Expense Tracking**: Add expenses with categories, dates, and descriptions
- **Smart Splitting**: Equal or custom split options for expenses
- **Bill Upload**: Upload and view receipts/bills for expenses
- **Monthly Summary**: View expenses by category and member
- **Settlement Calculator**: Automatic calculation of who owes whom
- **Dashboard**: Visual charts and statistics
- **Responsive UI**: Modern, clean interface with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Swagger/OpenAPI

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Recharts

 

 

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Rooms
- `POST /api/rooms` - Create room
- `POST /api/rooms/join` - Join room by code
- `GET /api/rooms` - Get user's rooms
- `GET /api/rooms/{id}` - Get room details
- `GET /api/rooms/{id}/members` - Get room members
- `DELETE /api/rooms/{roomId}/members/{memberId}` - Remove member

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses?roomId={id}` - Get expenses
- `GET /api/expenses/month?roomId={id}&year={y}&month={m}` - Get expenses by month
- `GET /api/expenses/{id}` - Get expense details
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Bills
- `POST /api/bills/upload` - Upload bill
- `GET /api/bills/{expenseId}` - Get bill image
- `DELETE /api/bills/{expenseId}` - Delete bill

### Summary
- `GET /api/summary/{roomId}?year={y}&month={m}` - Get monthly summary

### Categories
- `GET /api/categories` - Get all categories

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Create/Join Room**: Create a new room or join using a join code
3. **Add Expenses**: Add expenses with amount, description, category, and date
4. **Split Expenses**: Choose equal split or custom split among members
5. **Upload Bills**: Attach receipts/bills to expenses
6. **View Summary**: Check monthly summary and settlement suggestions
7. **Dashboard**: View charts and statistics

## 🔒 Security

- JWT tokens for authentication
- Password encryption using BCrypt
- Role-based access control (ADMIN, MEMBER)
- CORS configuration for frontend
- Input validation on all endpoints

## 📝 Notes

- Bill images are stored in `./uploads/bills` directory (backend)
- Default categories are auto-created on first run
- JWT secret should be changed in production
- Database schema is auto-created on first run


"# splitting-expenses-app" 
