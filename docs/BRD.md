# Business Requirements Document (BRD)

## Project Title
Sharing is Caring – Roommate Shared Expense Management System

## 1. Problem Statement

Roommates commonly share expenses such as rent, groceries, electricity, internet, food, and other household bills. Manually tracking who paid, who owes whom, and how much each person should contribute can become confusing and error-prone.

The proposed application provides a centralized platform where roommates can create or join a room, record shared expenses, split bills, upload receipts, view spending summaries, calculate balances, and manage settlements.

## 2. Objectives

- Simplify shared expense management between roommates.
- Automatically calculate expense splits.
- Track individual balances.
- Reduce manual calculations and misunderstandings.
- Provide monthly spending summaries.
- Provide a simple dashboard for monitoring household expenses.
- Allow users to maintain supporting bill/receipt records.

## 3. Target Users

- College students living with roommates.
- Working professionals sharing accommodation.
- Friends sharing household expenses.
- Any group that regularly shares expenses.

## 4. Functional Requirements

### FR-01: User Authentication
Users shall be able to:
- Register an account.
- Log in securely.
- Authenticate using JWT.
- Access functionality according to their role.

### FR-02: Room Management
Users shall be able to:
- Create a room.
- Join an existing room using a room code.
- View room members.
- Manage room membership.

### FR-03: Expense Management
Users shall be able to:
- Add expenses.
- Enter expense amount, description, category and date.
- Edit expenses.
- Delete expenses.
- View expenses associated with their room.

### FR-04: Expense Splitting
The system shall support:
- Equal expense splitting.
- Custom expense splitting.
- Automatic calculation of each member's share.

### FR-05: Bill and Receipt Management
Users shall be able to:
- Upload bills or receipts.
- Associate uploaded bills with expenses.
- View stored bills/receipts.

### FR-06: Monthly Summary
The system shall provide:
- Monthly expense summaries.
- Category-wise spending information.
- Member-wise spending information.

### FR-07: Settlement Management
The system shall:
- Calculate member balances.
- Identify who owes money and who should receive money.
- Provide settlement information to simplify repayments.

### FR-08: Dashboard
The dashboard shall provide:
- Overview of expenses.
- Spending information.
- Balance information.
- Charts and summaries.
- Quick access to major application features.

## 5. Non-Functional Requirements

### Performance
The application should respond efficiently to normal user operations.

### Security
- Passwords must be securely hashed.
- Authentication must use JWT.
- APIs must enforce authorization.
- User data must be protected from unauthorized access.

### Usability
The interface should be simple and understandable for users with basic technical knowledge.

### Responsiveness
The application should provide a usable experience across different screen sizes.

### Maintainability
The system should use a structured frontend and backend architecture so that future features can be added without unnecessary rewriting.

## 6. Technology Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Recharts

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- REST APIs
- JWT

### Database
- MySQL

### API Documentation
- Swagger / OpenAPI

## 7. Expected Outcome

The final system should provide roommates with a reliable platform to record, split, monitor and settle shared expenses while reducing manual calculations and improving transparency among members.