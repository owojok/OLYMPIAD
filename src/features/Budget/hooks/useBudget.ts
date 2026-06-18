import { useState, useEffect, useMemo } from 'react';
import { INITIAL_BUDGET } from '../../../data/eventData';
import type { BudgetVal } from '../../../data/eventData';

export const useBudget = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetVal[]>([]);
  const [errorMap, setErrorMap] = useState<{ [index: number]: string }>({});

  // Calculate default original total
  const originalTotal = useMemo(() => {
    return INITIAL_BUDGET.reduce((acc, curr) => acc + curr.cost, 0);
  }, []);

  // Load state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_budget_values');
      if (stored) {
        setBudgetItems(JSON.parse(stored));
      } else {
        setBudgetItems(INITIAL_BUDGET);
      }
    } catch (e) {
      console.error('Failed to load budget values from localStorage', e);
      setBudgetItems(INITIAL_BUDGET);
    }
  }, []);

  const updateItemCost = (index: number, value: string) => {
    // 1. Validation (R8 - No silent failures, R19 - Invariant: cost must be valid non-negative number)
    const sanitizedVal = value.replace(/,/g, '');
    const costNum = Number(sanitizedVal);
    
    const nextErrors = { ...errorMap };
    
    if (value.trim() === '') {
      nextErrors[index] = 'Cost cannot be empty.';
    } else if (isNaN(costNum)) {
      nextErrors[index] = 'Please enter a valid number.';
    } else if (costNum < 0) {
      nextErrors[index] = 'Cost cannot be negative.';
    } else {
      delete nextErrors[index];
    }
    
    setErrorMap(nextErrors);

    // Update state even if invalid, so the user can edit it, but we block calculations/saving of bad numbers or handle it gracefully
    const nextItems = budgetItems.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          // If valid number, update cost. Otherwise, leave it as is or keep string value inside a temporary holder.
          // To ensure clean state, we save the numeric value if it parsed correctly.
          cost: isNaN(costNum) || costNum < 0 ? item.cost : costNum
        };
      }
      return item;
    });

    setBudgetItems(nextItems);

    // Save only if there are no errors
    if (Object.keys(nextErrors).length === 0 && !isNaN(costNum) && costNum >= 0) {
      try {
        localStorage.setItem('so_budget_values', JSON.stringify(nextItems));
      } catch (e) {
        console.error('Failed to save budget state to localStorage', e);
      }
    }
  };

  const totalCost = useMemo(() => {
    return budgetItems.reduce((acc, curr) => acc + curr.cost, 0);
  }, [budgetItems]);

  const resetBudget = () => {
    setBudgetItems(INITIAL_BUDGET);
    setErrorMap({});
    try {
      localStorage.setItem('so_budget_values', JSON.stringify(INITIAL_BUDGET));
    } catch (e) {
      console.error('Failed to reset budget state in localStorage', e);
    }
  };

  return {
    budgetItems,
    errorMap,
    updateItemCost,
    totalCost,
    originalTotal,
    resetBudget
  };
};
export default useBudget;
