# Technical Design Document (TDD)

## 1. System Overview

The Roommate Shared Expense Management System is a full-stack web application that allows users to manage shared household expenses.

The system follows a three-layer architecture:

Frontend -> Backend REST API -> MySQL Database

The frontend communicates with the backend using HTTP requests. The backend handles authentication, business logic, validation and database operations.

---

## 2. Technology Stack

### Frontend

- React 18
- React Router
- Axios
- Tailwind CSS
- Recharts

### Backend

- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- JWT Authentication
- REST APIs

### Database

- MySQL

### API Documentation

- Swagger / OpenAPI

---

## 3. High-Level Architecture

User
 |
 v
React Frontend
 |
 | HTTP / REST
 v
Spring Boot Backend
 |
 v
MySQL Database

The React frontend provides the user interface. The Spring Boot backend handles application logic and REST APIs. MySQL stores application data.

---

## 4. Backend Architecture

The backend follows a layered architecture.

### Controller Layer

Controllers expose REST API endpoints and receive requests from the frontend.

Responsibilities:

- Receive HTTP requests.
- Validate request data.
- Return appropriate responses.
- Communicate with service classes.

### Service Layer

The service layer contains the application's business logic.

Responsibilities:

- Process expenses.
- Calculate expense splits.
- Manage rooms and members.
- Calculate balances.
- Generate summaries.
- Handle application rules.

### Repository Layer

Repositories communicate with the database through Spring Data JPA.

Responsibilities:

- Store application data.
- Retrieve records.
- Update records.
- Delete records.

### Security Layer

Spring Security and JWT are used to secure application access.

The system supports authentication and role-based authorization.

---

## 5. Frontend Architecture

The React frontend is responsible for the application's user interface and user interaction.

Major responsibilities include:

- User registration and login.
- Room management.
- Expense management.
- Expense splitting.
- Bill and receipt handling.
- Dashboard display.
- Charts and summaries.
- Settlement information.

Axios is used for communication with the Spring Boot REST APIs.

React Router manages navigation between application pages.

Tailwind CSS is used for responsive UI styling.

Recharts is used to display graphical expense information.

---

## 6. Authentication Flow

User
 |
 v
Login / Register
 |
 v
React Frontend
 |
 v
Spring Boot Authentication API
 |
 +-- Validate credentials
 |
 +-- Generate JWT
 |
 v
Frontend stores token
 |
 v
Authenticated API Requests

Passwords are protected using secure password hashing.

JWT tokens are used to authenticate subsequent requests.

---

## 7. Room Management Flow

A user can create a room or join an existing room using a room code.

### Creating a Room

Create Room
 |
 v
Backend validates request
 |
 v
Room created
 |
 v
User becomes room member

### Joining a Room

Room Code
 |
 v
Backend validates code
 |
 v
Membership created
 |
 v
User joins room

---

## 8. Expense Management Flow

User enters expense
 |
 v
Frontend validates input
 |
 v
REST API request
 |
 v
Backend validates request
 |
 v
Expense processing
 |
 v
Database persistence
 |
 v
Updated expense information
 |
 v
Frontend displays result

Expenses can contain information such as:

- Amount
- Description
- Category
- Date
- Room
- Payer
- Split information

---

## 9. Expense Splitting

The system supports different methods of splitting expenses.

### Equal Split

The total amount is divided equally among selected members.

Example:

Total Expense = Rs. 900
Members = 3

Each Member = Rs. 300

### Custom Split

Users can specify individual amounts for members.

Example:

Total Expense = Rs. 1000

Member A = Rs. 500
Member B = Rs. 300
Member C = Rs. 200

The backend validates the split information before storing the expense.

---

## 10. Bill / Receipt Flow

Users can upload supporting bills or receipts for expenses.

Select Bill
 |
 v
Frontend Upload
 |
 v
Backend Upload Endpoint
 |
 v
File Storage
 |
 v
Bill Associated With Expense

Uploaded bill files are stored separately from normal application data.

---

## 11. Settlement Flow

The system calculates financial balances between members based on recorded shared expenses.

Example:

Alice paid more than her share.
Therefore, Alice should receive money.

Bob owes money.
Therefore, Bob should pay Alice.

The settlement calculation helps simplify repayments between room members.

---

## 12. Dashboard and Summary

The dashboard provides an overview of household financial activity.

Information may include:

- Total expenses.
- Member balances.
- Recent expenses.
- Category-wise spending.
- Monthly summaries.
- Charts and visual insights.

All financial values displayed by the application should be derived from actual application data rather than hardcoded values.

---

## 13. API Design

The frontend communicates with backend REST endpoints.

### Authentication APIs

Used for:

- User registration.
- User login.
- Authentication.

### Room APIs

Used for:

- Creating rooms.
- Joining rooms.
- Managing members.

### Expense APIs

Used for:

- Creating expenses.
- Updating expenses.
- Deleting expenses.
- Retrieving expenses.

### Bill APIs

Used for:

- Uploading bills.
- Viewing bills.

### Summary APIs

Used for:

- Monthly summaries.
- Category summaries.
- Member summaries.

### Category APIs

Used for:

- Retrieving expense categories.

---

## 14. Error Handling

The application should provide meaningful error responses for situations such as:

- Invalid login credentials.
- Invalid room code.
- Unauthorized access.
- Invalid expense amount.
- Invalid split values.
- Missing required fields.
- File upload failures.
- Server errors.

The frontend should display understandable messages to users rather than exposing internal server details.

---

## 15. Security Requirements

The application uses:

- JWT-based authentication.
- Spring Security.
- Password hashing.
- Role-based authorization.
- API-level access control.
- Input validation.
- CORS configuration.

Sensitive configuration such as production JWT secrets and database credentials should not be exposed in source code.

---

## 16. Responsiveness

The frontend should provide a usable experience on:

- Desktop screens.
- Laptop screens.
- Tablets.
- Mobile-sized screens.

Layouts and components should adapt to different screen sizes.

---

## 17. Maintainability

Development should follow these principles:

- Reuse existing components.
- Avoid unnecessary duplication.
- Keep frontend and backend responsibilities separated.
- Keep business logic inside backend services.
- Keep database operations inside repositories.
- Avoid hardcoded financial information.
- Make incremental changes.
- Test changes before merging.

---

## 18. Deployment Considerations

Before deployment:

- Configure production database credentials.
- Configure secure JWT secrets.
- Configure allowed frontend/backend origins.
- Verify file upload storage.
- Build and test the frontend.
- Build and test the backend.
- Verify major APIs.
- Perform regression testing.

---

## 19. Future Extensibility

The architecture allows future features such as:

- Notifications.
- Advanced spending analytics.
- Budget management.
- Recurring expenses.
- Additional settlement options.
- Mobile application support.
- External service integrations.

Future features should be added without unnecessarily replacing existing working functionality.

---

## 20. Technical Development Guidelines

Because this is an existing working application, future development should follow a controlled incremental approach.

Before modifying any feature:

1. Inspect the existing implementation.
2. Identify the relevant frontend and backend files.
3. Understand the existing API and data flow.
4. Make the smallest required change.
5. Avoid modifying unrelated features.
6. Test the affected functionality.
7. Check that existing functionality still works.
8. Commit changes with a meaningful Git commit message.
9. Push changes through the appropriate feature branch.
10. Merge changes through a Pull Request after review.

The existing architecture, APIs, database and working features should not be replaced unless there is a clear technical requirement to do so.

---

## Conclusion

The Technical Design Document defines the architecture, technology stack, application flows, security requirements and development guidelines for the Roommate Shared Expense Management System.

The system is designed as a maintainable full-stack application where the React frontend communicates with Spring Boot REST APIs and the backend manages business logic and database operations.

All future development should preserve existing functionality and follow an incremental, tested and review-based development process.