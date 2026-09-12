# User Stories

## 1. Introduction

This document defines the major user stories for the Roommate Shared Expense Management System.

The user stories describe the system from the perspective of the users and define what users should be able to accomplish using the application.

---

# 2. User Roles

The system mainly supports the following users:

### Room Admin

A user who creates and manages a room.

### Room Member

A user who joins an existing room and participates in shared expense management.

---

# 3. Epic 1 – User Authentication

## US-01: User Registration

As a new user,
I want to create an account,
so that I can access the shared expense management system.

### Acceptance Criteria

- User can enter required registration details.
- System validates the entered information.
- Password is securely stored.
- User receives appropriate feedback for successful or unsuccessful registration.
- Duplicate account information is handled appropriately.

---

## US-02: User Login

As a registered user,
I want to log in securely,
so that I can access my rooms and expenses.

### Acceptance Criteria

- User can enter login credentials.
- System validates the credentials.
- Successful authentication provides access to the application.
- Invalid credentials display an appropriate error message.
- Unauthorized users cannot access protected resources.

---

## US-03: Secure Session

As an authenticated user,
I want my session to remain secure,
so that unauthorized users cannot access my account.

### Acceptance Criteria

- Authentication uses JWT.
- Protected APIs require valid authentication.
- Unauthorized requests are rejected.
- User roles are respected.

---

# 4. Epic 2 – Room Management

## US-04: Create Room

As a user,
I want to create a room,
so that I can manage shared expenses with my roommates.

### Acceptance Criteria

- User can provide room information.
- A room is created successfully.
- The creator becomes a member of the room.
- The room becomes available from the user's account.

---

## US-05: Join Room

As a user,
I want to join a room using a room code,
so that I can participate in shared expenses.

### Acceptance Criteria

- User can enter a valid room code.
- System validates the room code.
- User is added to the room.
- Invalid room codes display an appropriate error message.

---

## US-06: View Room Members

As a room member,
I want to view the members of my room,
so that I know who participates in shared expenses.

### Acceptance Criteria

- Room members are displayed.
- Member information is retrieved from the backend.
- Only members belonging to the room are displayed.

---

## US-07: Manage Multiple Rooms

As a user,
I want to access my rooms,
so that I can manage expenses separately for different groups.

### Acceptance Criteria

- User can view available rooms.
- User can select a room.
- Data displayed should correspond to the selected room.
- Switching rooms should not mix expense information.

---

# 5. Epic 3 – Expense Management

## US-08: Add Expense

As a room member,
I want to record a shared expense,
so that everyone can track their financial contribution.

### Acceptance Criteria

- User can enter expense amount.
- User can enter expense description.
- User can select an expense category.
- User can select the expense date.
- User can select the members involved.
- Expense is saved successfully.

---

## US-09: View Expenses

As a room member,
I want to view recorded expenses,
so that I can track household spending.

### Acceptance Criteria

- Expenses are retrieved from the backend.
- Expense details are displayed clearly.
- Expenses belong to the selected room.
- Users can view relevant expense information.

---

## US-10: Update Expense

As a user,
I want to update an expense,
so that incorrect expense information can be corrected.

### Acceptance Criteria

- Existing expense information can be modified.
- Updated information is validated.
- Changes are persisted.
- Updated information is reflected in the application.

---

## US-11: Delete Expense

As a user,
I want to delete an incorrect expense,
so that inaccurate records do not affect balances.

### Acceptance Criteria

- User can request deletion of an expense.
- System processes the deletion securely.
- Deleted expense is no longer included in calculations.

---

# 6. Epic 4 – Expense Splitting

## US-12: Equal Expense Split

As a room member,
I want to split an expense equally,
so that everyone pays the same amount.

### Acceptance Criteria

- User can select equal splitting.
- System divides the expense among selected members.
- Individual shares are calculated correctly.
- Total shares equal the original expense amount.

### Example

Expense = Rs. 900

Members = 3

Each member share = Rs. 300

---

## US-13: Custom Expense Split

As a room member,
I want to specify custom shares,
so that expenses can be divided according to individual contributions.

### Acceptance Criteria

- User can specify individual amounts.
- System validates the entered values.
- Total individual shares must match the expense amount.
- Invalid split information is rejected.

### Example

Expense = Rs. 1000

Member A = Rs. 500
Member B = Rs. 300
Member C = Rs. 200

---

# 7. Epic 5 – Bills and Receipts

## US-14: Upload Bill

As a room member,
I want to upload a bill or receipt,
so that I can keep supporting evidence for an expense.

### Acceptance Criteria

- User can select a bill or receipt.
- File is uploaded successfully.
- File is associated with the relevant expense.
- Upload errors are handled appropriately.

---

## US-15: View Bill

As a room member,
I want to view an uploaded bill,
so that I can verify the expense details.

### Acceptance Criteria

- User can access the bill associated with an expense.
- Authorized users can view the uploaded file.
- Unauthorized access is prevented.

---

# 8. Epic 6 – Expense Summary and Insights

## US-16: View Monthly Summary

As a room member,
I want to view monthly expense summaries,
so that I can understand how much the room spends each month.

### Acceptance Criteria

- System provides monthly expense information.
- Summary is based on actual recorded expenses.
- Users can understand total spending for the selected period.

---

## US-17: View Category-wise Spending

As a room member,
I want to see spending by category,
so that I can understand where money is being spent.

### Acceptance Criteria

- Expenses are grouped by category.
- Category totals are calculated from actual expense data.
- Category information can be represented visually.

---

## US-18: View Member-wise Spending

As a room member,
I want to view member-related spending information,
so that I can understand individual contributions.

### Acceptance Criteria

- Member-related expense information is calculated from actual data.
- The information is displayed clearly.
- Users can understand each member's contribution.

---

# 9. Epic 7 – Settlements

## US-19: View Balance

As a room member,
I want to view my current balance,
so that I know whether I owe money or should receive money.

### Acceptance Criteria

- System calculates the user's balance.
- Balance is based on recorded expenses and splits.
- The displayed amount is derived from actual data.

---

## US-20: Calculate Settlements

As a room member,
I want the system to calculate settlements,
so that I know how shared expenses can be settled.

### Acceptance Criteria

- System calculates outstanding balances.
- Members who owe money are identified.
- Members who should receive money are identified.
- Settlement information is displayed clearly.

### Example

Alice should receive Rs. 500.

Bob owes Rs. 300.

Charlie owes Rs. 200.

The system provides the settlement information required to balance the shared expenses.

---

## US-21: View Settlement History

As a room member,
I want to view settlement-related information,
so that I can track previous financial settlements.

### Acceptance Criteria

- Settlement information is displayed when available.
- Information corresponds to the selected room.
- Unauthorized users cannot access another room's information.

---

# 10. Epic 8 – Dashboard

## US-22: View Dashboard

As a room member,
I want to see a dashboard,
so that I can quickly understand my room's financial status.

### Acceptance Criteria

The dashboard can display:

- Total expenses.
- Current balance.
- Recent expenses.
- Spending information.
- Member information.
- Summary information.
- Charts or visual insights.

All financial values must come from actual application data.

---

## US-23: View Recent Activity

As a room member,
I want to see recent expense activity,
so that I can quickly understand what has recently happened in the room.

### Acceptance Criteria

- Recent expenses are displayed.
- Expense information is retrieved from the backend.
- Activity corresponds to the selected room.

---

# 11. Epic 9 – Categories

## US-24: View Expense Categories

As a room member,
I want to select an expense category,
so that expenses can be organized properly.

### Acceptance Criteria

- Available categories can be retrieved.
- User can select a category while creating an expense.
- Category information is associated with the expense.

---

# 12. Epic 10 – Security and Authorization

## US-25: Protect Room Data

As a user,
I want room data to be protected,
so that only authorized members can access it.

### Acceptance Criteria

- Protected APIs require authentication.
- Users cannot access unauthorized room information.
- Backend authorization rules are enforced.

---

## US-26: Protect User Information

As a user,
I want my account information to be secure,
so that unauthorized users cannot access my data.

### Acceptance Criteria

- Passwords are securely stored.
- Authentication is required for protected operations.
- JWT authentication is used for secured API requests.
- Sensitive configuration is not exposed.

---

# 13. Epic 11 – User Experience

## US-27: Responsive Interface

As a user,
I want the application to work on different screen sizes,
so that I can use it comfortably on different devices.

### Acceptance Criteria

- Interface works on desktop screens.
- Interface works on laptop screens.
- Interface adapts to tablet and mobile-sized screens.
- Important controls remain accessible.

---

## US-28: Meaningful Error Messages

As a user,
I want understandable error messages,
so that I know what went wrong and what I should do next.

### Acceptance Criteria

- Validation errors are understandable.
- Authentication errors are understandable.
- Room errors are understandable.
- Expense errors are understandable.
- File upload errors are understandable.
- Internal technical details are not unnecessarily exposed.

---

# 14. Epic 12 – System Reliability

## US-29: Preserve Existing Data

As a user,
I want my existing rooms and expenses to remain available,
so that application updates do not cause data loss.

### Acceptance Criteria

- Existing data is not unnecessarily modified.
- Database changes are carefully managed.
- Existing APIs are preserved unless a change is genuinely required.

---

## US-30: Stable Application

As a user,
I want existing features to continue working after updates,
so that new improvements do not break the application.

### Acceptance Criteria

- Changes are tested before merging.
- Existing features are regression tested.
- Unrelated functionality is not modified unnecessarily.
- Code changes are reviewed through Pull Requests.

---

# 15. User Story Priorities

## High Priority

- US-01 User Registration
- US-02 User Login
- US-04 Create Room
- US-05 Join Room
- US-08 Add Expense
- US-09 View Expenses
- US-12 Equal Expense Split
- US-13 Custom Expense Split
- US-19 View Balance
- US-20 Calculate Settlements
- US-22 View Dashboard

## Medium Priority

- US-03 Secure Session
- US-06 View Room Members
- US-07 Manage Multiple Rooms
- US-10 Update Expense
- US-11 Delete Expense
- US-14 Upload Bill
- US-15 View Bill
- US-16 Monthly Summary
- US-17 Category-wise Spending
- US-18 Member-wise Spending
- US-23 Recent Activity
- US-24 Expense Categories

## Supporting / Quality

- US-21 Settlement History
- US-25 Protect Room Data
- US-26 Protect User Information
- US-27 Responsive Interface
- US-28 Meaningful Error Messages
- US-29 Preserve Existing Data
- US-30 Stable Application

---

# 16. Definition of Done

A user story is considered complete when:

1. The requested functionality is implemented.
2. Existing functionality is not unnecessarily affected.
3. Frontend and backend changes work together correctly.
4. Required validation is implemented.
5. Relevant errors are handled.
6. The affected functionality is tested.
7. No obvious compilation or runtime errors remain.
8. Code is committed using a meaningful Git commit message.
9. Changes are pushed to the appropriate feature branch.
10. Pull Request is created when required.
11. Changes are reviewed before merging.

---

# Conclusion

These user stories define the functional expectations of the Roommate Shared Expense Management System.

They provide a structured basis for development, sprint planning, GitHub issues, testing and Pull Request reviews.

Each team member should work on clearly defined user stories and contribute through meaningful, reviewable changes without unnecessarily modifying existing working functionality.