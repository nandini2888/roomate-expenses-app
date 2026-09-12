/**
 * Utility functions for expense form validation.
 * Reusable and pure for comprehensive testing.
 */

export const validateExpenseForm = (formData, roomId) => {
  const errors = {};
  const splitRowErrors = [];

  // 1. Validate Room
  if (!roomId || isNaN(Number(roomId))) {
    errors.general = 'Please select a valid room before creating an expense.';
  }

  // 2. Validate Amount
  const amountStr = String(formData.amount || '').trim();
  if (!amountStr) {
    errors.amount = 'Amount is required.';
  } else {
    const amountNum = Number(amountStr);
    if (isNaN(amountNum) || !/^\d+(\.\d+)?$/.test(amountStr)) {
      errors.amount = 'Amount must be a valid numeric value.';
    } else if (amountNum <= 0) {
      errors.amount = 'Amount must be greater than 0.';
    } else {
      const parts = amountStr.split('.');
      if (parts[1] && parts[1].length > 2) {
        errors.amount = 'Amount cannot have more than 2 decimal places.';
      }
    }
  }

  // 3. Validate Expense Date
  const dateStr = String(formData.expenseDate || '').trim();
  if (!dateStr) {
    errors.expenseDate = 'Expense date is required.';
  } else if (isNaN(Date.parse(dateStr))) {
    errors.expenseDate = 'Please provide a valid date.';
  }

  // 4. Validate Description
  const descStr = String(formData.description || '').trim();
  if (!descStr) {
    errors.description = 'Description is required.';
  } else if (descStr.length > 255) {
    errors.description = 'Description cannot exceed 255 characters.';
  }

  // 5. Validate Paid By
  const paidByIdStr = String(formData.paidById || '').trim();
  if (!paidByIdStr) {
    errors.paidById = 'Please select who paid for this expense.';
  }

  // 6. Validate Custom Splits
  if (formData.splitType === 'CUSTOM') {
    const splits = formData.splits || [];
    if (splits.length === 0) {
      errors.splits = 'Please add at least one split entry for custom split.';
    } else {
      const userIdsSeen = new Set();
      let totalSplitAmountCents = 0;
      let hasRowError = false;

      splits.forEach((split, index) => {
        const rowErr = {};
        const userIdStr = String(split.userId || '').trim();
        const splitAmountStr = String(split.amount || '').trim();

        if (!userIdStr) {
          rowErr.userId = 'Please select a member.';
          hasRowError = true;
        } else if (userIdsSeen.has(userIdStr)) {
          rowErr.userId = 'Member cannot be assigned multiple splits.';
          hasRowError = true;
        } else {
          userIdsSeen.add(userIdStr);
        }

        if (!splitAmountStr) {
          rowErr.amount = 'Split amount is required.';
          hasRowError = true;
        } else {
          const splitNum = Number(splitAmountStr);
          if (isNaN(splitNum) || !/^\d+(\.\d+)?$/.test(splitAmountStr)) {
            rowErr.amount = 'Must be a valid positive number.';
            hasRowError = true;
          } else if (splitNum <= 0) {
            rowErr.amount = 'Must be greater than 0.';
            hasRowError = true;
          } else {
            const parts = splitAmountStr.split('.');
            if (parts[1] && parts[1].length > 2) {
              rowErr.amount = 'Max 2 decimal places.';
              hasRowError = true;
            } else {
              totalSplitAmountCents += Math.round(splitNum * 100);
            }
          }
        }
        splitRowErrors[index] = rowErr;
      });

      if (hasRowError) {
        errors.splitRows = splitRowErrors;
      }

      // Check sum equality only if base amount is valid and no row errors
      const amountNum = Number(amountStr);
      if (!errors.amount && amountNum > 0 && !hasRowError) {
        const expenseAmountCents = Math.round(amountNum * 100);
        if (totalSplitAmountCents !== expenseAmountCents) {
          const diffNum = (expenseAmountCents - totalSplitAmountCents) / 100;
          const diffFormatted = Math.abs(diffNum).toFixed(2);
          const allocated = (totalSplitAmountCents / 100).toFixed(2);
          const total = (expenseAmountCents / 100).toFixed(2);
          errors.splits = `Custom splits total ($${allocated}) must equal the expense amount ($${total}). Difference: ${diffNum > 0 ? `+$${diffFormatted} remaining` : `-$${diffFormatted} exceeded`}.`;
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
