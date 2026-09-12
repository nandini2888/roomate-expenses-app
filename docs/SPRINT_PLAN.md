# Sprint Plan

# Roommate Shared Expense Management System

## 1. Sprint Overview

The project will be developed using an incremental sprint-based approach.

Each sprint focuses on a specific group of related features. Existing functionality should be preserved while improvements are introduced in small, testable changes.

The project is divided into five major sprints:

- Sprint 1 – Authentication and Room Management
- Sprint 2 – Expense Management and Splitting
- Sprint 3 – Bills and Settlements
- Sprint 4 – Dashboard and Insights
- Sprint 5 – Testing, Quality and Finalization

---

# 2. Sprint 1 – Authentication and Room Management

## Sprint Goal

Provide a secure authentication system and allow users to create, join and manage rooms.

## User Stories

- US-01 – User Registration
- US-02 – User Login
- US-03 – Secure Session
- US-04 – Create Room
- US-05 – Join Room
- US-06 – View Room Members
- US-07 – Manage Multiple Rooms
- US-25 – Protect Room Data
- US-26 – Protect User Information

## Tasks

### Authentication

- Verify user registration flow.
- Verify login flow.
- Validate authentication inputs.
- Verify JWT authentication.
- Verify protected API access.
- Handle invalid authentication attempts.

### Room Management

- Verify room creation.
- Verify room joining using room code.
- Verify room member display.
- Verify room selection.
- Verify that room data remains isolated between rooms.

### Testing

- Test registration.
- Test login.
- Test invalid credentials.
- Test room creation.
- Test room joining.
- Test invalid room code.
- Test unauthorized access.

## Expected Outcome

Users should be able to securely register, log in, create rooms, join rooms and view their room members.

---

# 3. Sprint 2 – Expense Management and Splitting

## Sprint Goal

Provide complete shared expense recording and splitting functionality.

## User Stories

- US-08 – Add Expense
- US-09 – View Expenses
- US-10 – Update Expense
- US-11 – Delete Expense
- US-12 – Equal Expense Split
- US-13 – Custom Expense Split
- US-24 – View Expense Categories

## Tasks

### Expense Management

- Verify expense creation.
- Verify expense amount validation.
- Verify expense description.
- Verify expense category.
- Verify expense date.
- Verify expense retrieval.
- Verify expense update.
- Verify expense deletion.

### Expense Splitting

- Verify equal splitting.
- Verify custom splitting.
- Validate total split amount.
- Prevent invalid split values.
- Verify member-wise shares.

### Categories

- Verify category retrieval.
- Verify category selection.
- Verify category association with expenses.

### Testing

- Test adding expenses.
- Test viewing expenses.
- Test updating expenses.
- Test deleting expenses.
- Test equal split calculations.
- Test custom split calculations.
- Test invalid split values.
- Test category selection.

## Expected Outcome

Room members should be able to record expenses, divide them among members and maintain accurate expense records.

---

# 4. Sprint 3 – Bills and Settlements

## Sprint Goal

Provide bill/receipt management and accurate settlement calculations.

## User Stories

- US-14 – Upload Bill
- US-15 – View Bill
- US-19 – View Balance
- US-20 – Calculate Settlements
- US-21 – View Settlement History

## Tasks

### Bills and Receipts

- Verify bill upload.
- Associate bills with expenses.
- Verify bill viewing.
- Handle invalid or failed uploads.
- Protect bill access.

### Balances

- Calculate member balances.
- Verify balances using actual expense data.
- Verify payer and participant relationships.
- Verify room-specific balances.

### Settlements

- Calculate amounts owed.
- Identify members who should receive money.
- Identify members who should pay money.
- Verify settlement calculations.
- Display settlement information clearly.

### Testing

- Test bill upload.
- Test bill viewing.
- Test balance calculation.
- Test settlement calculation.
- Test multiple members.
- Test different expense scenarios.

## Expected Outcome

Users should be able to attach bills to expenses, understand their balances and determine how shared expenses can be settled.

---

# 5. Sprint 4 – Dashboard and Insights

## Sprint Goal

Provide a clear dashboard that summarizes the financial status of the selected room.

## User Stories

- US-16 – View Monthly Summary
- US-17 – View Category-wise Spending
- US-18 – View Member-wise Spending
- US-22 – View Dashboard
- US-23 – View Recent Activity
- US-27 – Responsive Interface

## Tasks

### Dashboard

- Display total expenses.
- Display current balance.
- Display recent expenses.
- Display room/member information.
- Display relevant financial summaries.

### Insights

- Implement monthly expense summary.
- Implement category-wise spending.
- Implement member-wise spending.
- Display spending information using charts where appropriate.

### Recent Activity

- Display recent expense activity.
- Ensure information comes from actual backend data.
- Ensure activity corresponds to the selected room.

### Responsive Design

- Test desktop layout.
- Test laptop layout.
- Test tablet layout.
- Test mobile-sized layout.
- Improve usability of important controls.

### Testing

- Verify dashboard calculations.
- Verify summary calculations.
- Verify chart data.
- Verify room-specific information.
- Test responsive layouts.

## Expected Outcome

Users should have a clear visual overview of room expenses, balances, spending patterns and recent activity.

---

# 6. Sprint 5 – Testing, Quality and Finalization

## Sprint Goal

Improve reliability, usability and maintainability and prepare the application for final delivery.

## User Stories

- US-28 – Meaningful Error Messages
- US-29 – Preserve Existing Data
- US-30 – Stable Application

## Tasks

### Functional Testing

Test:

- Registration.
- Login.
- Room creation.
- Room joining.
- Member management.
- Expense creation.
- Expense splitting.
- Expense editing.
- Expense deletion.
- Bill upload.
- Bill viewing.
- Balance calculation.
- Settlement calculation.
- Dashboard.
- Monthly summaries.
- Charts.

### Error Handling

Verify appropriate handling of:

- Invalid login.
- Invalid room code.
- Missing required fields.
- Invalid expense amounts.
- Invalid split values.
- Unauthorized requests.
- File upload errors.
- Backend errors.

### Security Testing

Verify:

- JWT authentication.
- Protected endpoints.
- Authorization.
- Password protection.
- Room data isolation.
- Secure handling of sensitive configuration.

### UI Testing

Verify:

- Responsive layouts.
- Navigation.
- Forms.
- Buttons.
- Error messages.
- Loading states.
- Empty states.
- Charts.
- General usability.

### Regression Testing

Ensure that newly introduced changes do not break existing functionality.

### Documentation

Review:

- BRD.md
- TDD.md
- USER_STORIES.md
- SPRINT_PLAN.md
- README.md

## Expected Outcome

The application should be stable, tested, documented and ready for final demonstration and delivery.

---

# 7. Team Contribution Plan

The project should be divided into meaningful contributions so that each team member works on a specific area.

## Member 1 – Project Integration and Final Coordination

Responsibilities:

- Overall project coordination.
- Integration of team contributions.
- Dashboard/home improvements.
- Documentation.
- Final testing.
- GitHub repository management.

Primary Areas:

- Dashboard.
- Documentation.
- Integration.
- Final quality checks.

---

## Member 2 – Authentication

Responsibilities:

- Registration validation.
- Login validation.
- Authentication error handling.
- Authentication UI improvements.
- Security-related testing.

Primary User Stories:

- US-01
- US-02
- US-03
- US-25
- US-26

---

## Member 3 – Expense Management

Responsibilities:

- Expense form improvements.
- Expense validation.
- Expense creation flow.
- Expense editing/deletion.
- Expense-related testing.

Primary User Stories:

- US-08
- US-09
- US-10
- US-11
- US-24

---

## Member 4 – Room and Member Management

Responsibilities:

- Room creation/joining flow.
- Room member interface.
- Room selection.
- Room-related validation.
- Room management testing.

Primary User Stories:

- US-04
- US-05
- US-06
- US-07

---

## Member 5 – Settlements and Financial Tracking

Responsibilities:

- Balance display.
- Settlement calculations.
- Settlement interface.
- Settlement history.
- Bill/receipt flow improvements.

Primary User Stories:

- US-14
- US-15
- US-19
- US-20
- US-21

---

## Member 6 – Dashboard and Insights

Responsibilities:

- Dashboard improvements.
- Spending summaries.
- Charts.
- Recent activity.
- Responsive UI improvements.

Primary User Stories:

- US-16
- US-17
- US-18
- US-22
- US-23
- US-27

---

# 8. Git Development Workflow

All team members should use feature branches.

Recommended structure:

main
|
└── develop
    |
    ├── feature/auth
    ├── feature/expenses
    ├── feature/room-management
    ├── feature/settlements
    ├── feature/insights
    └── feature/dashboard

## Workflow

1. Start from the latest develop branch.
2. Create a feature branch.
3. Work only on the assigned task.
4. Make meaningful changes.
5. Test the changes.
6. Commit the changes.
7. Push the feature branch.
8. Create a Pull Request.
9. Review the changes.
10. Merge into develop.
11. Perform integration testing.
12. Merge the stable version into main.

---

# 9. Commit Guidelines

Commits should clearly describe the actual work performed.

Examples:

feat: improve expense form validation

feat: add room member management

fix: handle invalid login errors

fix: correct settlement calculation

ui: improve dashboard layout

test: add expense validation tests

docs: update project documentation

Do not create fake commits or commits that do not represent actual work.

---

# 10. Pull Request Guidelines

Every Pull Request should contain:

### Title

A short description of the change.

Example:

Improve expense validation

### Description

Include:

- What was changed.
- Why it was changed.
- Which user story it addresses.
- How it was tested.
- Any known limitations.

### Review Checklist

- [ ] Requested functionality works.
- [ ] Existing functionality still works.
- [ ] No unrelated files were changed.
- [ ] No unnecessary dependencies were added.
- [ ] No hardcoded financial data was introduced.
- [ ] Frontend errors checked.
- [ ] Backend errors checked.
- [ ] Changes are understandable and maintainable.

---

# 11. Definition of Done

A task is considered complete when:

- Implementation is finished.
- Required validation is present.
- Relevant functionality is tested.
- Existing functionality remains stable.
- No obvious errors remain.
- Code is committed.
- Feature branch is pushed.
- Pull Request is created.
- Review is completed.
- Changes are merged into develop.

---

# 12. Final Project Completion Criteria

The project is considered ready for final delivery when:

1. Authentication works correctly.
2. Users can create and join rooms.
3. Room members can be managed.
4. Expenses can be created and viewed.
5. Expenses can be split correctly.
6. Bills and receipts can be handled.
7. Balances are calculated correctly.
8. Settlements are calculated correctly.
9. Dashboard information is accurate.
10. Monthly and category summaries work.
11. Charts display actual application data.
12. Application is responsive.
13. Security requirements are satisfied.
14. Error handling is appropriate.
15. Existing functionality has been regression tested.
16. Documentation is complete.
17. GitHub branches and Pull Requests are organized.
18. The final stable version is available on the main branch.

---

# Conclusion

The sprint plan provides a structured development and collaboration process for the Roommate Shared Expense Management System.

The project will be developed incrementally through clearly defined user stories, team responsibilities, feature branches, meaningful commits and Pull Requests.

The primary objective is to improve and maintain the existing working application without unnecessarily replacing its architecture or breaking existing functionality.