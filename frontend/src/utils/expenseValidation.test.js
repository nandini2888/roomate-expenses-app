import { validateExpenseForm } from '../utils/expenseValidation';

describe('validateExpenseForm', () => {
  const baseValidForm = {
    amount: '100.00',
    description: 'Groceries at Costco',
    expenseDate: '2026-09-12',
    categoryId: '1',
    paidById: '1',
    splitType: 'EQUAL',
    splits: [],
  };

  test('1. Valid expense with required fields and valid amount passes', () => {
    const res = validateExpenseForm(baseValidForm, '10');
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  test('2. Missing required fields are detected with proper error messages', () => {
    const invalidForm = {
      amount: '',
      description: '   ',
      expenseDate: '',
      paidById: '',
      splitType: 'EQUAL',
      splits: [],
    };
    const res = validateExpenseForm(invalidForm, null);
    expect(res.isValid).toBe(false);
    expect(res.errors.amount).toBe('Amount is required.');
    expect(res.errors.description).toBe('Description is required.');
    expect(res.errors.expenseDate).toBe('Expense date is required.');
    expect(res.errors.paidById).toBe('Please select who paid for this expense.');
    expect(res.errors.general).toBe('Please select a valid room before creating an expense.');
  });

  test('3. Rejects zero, negative, and invalid numeric amounts', () => {
    // Zero
    let res = validateExpenseForm({ ...baseValidForm, amount: '0' }, '10');
    expect(res.isValid).toBe(false);
    expect(res.errors.amount).toBe('Amount must be greater than 0.');

    // Negative
    res = validateExpenseForm({ ...baseValidForm, amount: '-15.50' }, '10');
    expect(res.isValid).toBe(false);
    expect(res.errors.amount).toBe('Amount must be a valid numeric value.');

    // Non-numeric
    res = validateExpenseForm({ ...baseValidForm, amount: 'abc' }, '10');
    expect(res.isValid).toBe(false);
    expect(res.errors.amount).toBe('Amount must be a valid numeric value.');

    // Excessive decimal places
    res = validateExpenseForm({ ...baseValidForm, amount: '12.345' }, '10');
    expect(res.isValid).toBe(false);
    expect(res.errors.amount).toBe('Amount cannot have more than 2 decimal places.');
  });

  test('4. Validates custom splits - requires split entries', () => {
    const customForm = {
      ...baseValidForm,
      splitType: 'CUSTOM',
      splits: [],
    };
    const res = validateExpenseForm(customForm, '10');
    expect(res.isValid).toBe(false);
    expect(res.errors.splits).toBe('Please add at least one split entry for custom split.');
  });

  test('5. Validates custom splits - rejects invalid row values and duplicates', () => {
    const customForm = {
      ...baseValidForm,
      amount: '50.00',
      splitType: 'CUSTOM',
      splits: [
        { userId: '1', amount: '0' },
        { userId: '1', amount: '25.00' },
        { userId: '', amount: '-5.00' },
      ],
    };
    const res = validateExpenseForm(customForm, '10');
    expect(res.isValid).toBe(false);
    expect(res.errors.splitRows[0].amount).toBe('Must be greater than 0.');
    expect(res.errors.splitRows[1].userId).toBe('Member cannot be assigned multiple splits.');
    expect(res.errors.splitRows[2].userId).toBe('Please select a member.');
    expect(res.errors.splitRows[2].amount).toBe('Must be a valid positive number.');
  });

  test('6. Validates custom splits sum equality against expense amount', () => {
    // Splits sum to 40 instead of 50
    const customFormUnder = {
      ...baseValidForm,
      amount: '50.00',
      splitType: 'CUSTOM',
      splits: [
        { userId: '1', amount: '20.00' },
        { userId: '2', amount: '20.00' },
      ],
    };
    let res = validateExpenseForm(customFormUnder, '10');
    expect(res.isValid).toBe(false);
    expect(res.errors.splits).toContain('+$10.00 remaining');

    // Splits sum to 60 instead of 50
    const customFormOver = {
      ...baseValidForm,
      amount: '50.00',
      splitType: 'CUSTOM',
      splits: [
        { userId: '1', amount: '30.00' },
        { userId: '2', amount: '30.00' },
      ],
    };
    res = validateExpenseForm(customFormOver, '10');
    expect(res.isValid).toBe(false);
    expect(res.errors.splits).toContain('-$10.00 exceeded');
  });

  test('7. Valid custom splits adding up exactly to amount pass validation', () => {
    const customFormValid = {
      ...baseValidForm,
      amount: '75.25',
      splitType: 'CUSTOM',
      splits: [
        { userId: '1', amount: '25.25' },
        { userId: '2', amount: '50.00' },
      ],
    };
    const res = validateExpenseForm(customFormValid, '10');
    expect(res.isValid).toBe(true);
    expect(res.errors.splits).toBeUndefined();
  });
});
