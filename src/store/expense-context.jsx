import React, { useReducer } from 'react';

const ExpenseContext = React.createContext({
  expenses: [],
  addExpense: (expense) => {},
});

const initialExpenseState = {
  expenses: [],
};

const expensesReducer = (state, action) => {
  if (action.type === 'ADD_EXPENSE') {
    const updatedExpenses = state.expenses.concat(action.expense);

    return { expenses: updatedExpenses };
  }
  return state;
};

export const ExpenseProvider = (props) => {
  const [expensesState, dispatchExpenses] = useReducer(
    expensesReducer,
    initialExpenseState
  );

  const addExpenseHandler = (expense) => {
    dispatchExpenses({ type: 'ADD_EXPENSE', expense });
  };

  const expenseContext = {
    expenses: expensesState.expenses,
    addExpense: addExpenseHandler,
  };

  return (
    <ExpenseContext.Provider value={expenseContext}>
      {props.children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
