import React, { useReducer } from 'react';

const ExpenseContext = React.createContext({
  expenses: [],
  addExpense: (expense) => {},
  deleteExpense: (id) => {},
  updatedExpense: (id, expense) => {},
});

const initialExpenseState = {
  expenses: [
    {
      id: '1',
      amount: 220,
      description: 'The best food I have seen',
      category: 'Fuel',
    },
    {
      id: '2',
      amount: 999.99,
      description: 'The best food I have seen',
      category: 'Food',
    },
  ],
};

const expensesReducer = (state, action) => {
  if (action.type === 'ADD_EXPENSE') {
    const updatedExpenses = state.expenses.concat(action.expense);

    return { expenses: updatedExpenses };
  }
  if (action.type === 'DELETE_EXPENSE') {
    const updatedExpenses = state.expenses.filter(
      (item) => item.id !== action.id
    );

    return { expenses: updatedExpenses };
  }

  if (action.type === 'UPDATE_EXPENSE') {
    const expenseIndex = state.expenses.findIndex(
      (item) => item.id === action.payload.id
    );

    const expense = state.expenses[expenseIndex];

    let updatedExpenses = [...state.expenses];

    if (expense) {
      let updatedExpense = { ...expense, ...action.payload.expense };
      updatedExpenses[expenseIndex] = updatedExpense;
    }

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

  const deleteExpenseHandler = (id) => {
    dispatchExpenses({ type: 'DELETE_EXPENSE', id });
  };

  const updatedExpenseHandler = (id, expense) => {
    dispatchExpenses({ type: 'UPDATE_EXPENSE', payload: { id, expense } });
  };

  const expenseContext = {
    expenses: expensesState.expenses,
    addExpense: addExpenseHandler,
    deleteExpense: deleteExpenseHandler,
    updatedExpense: updatedExpenseHandler,
  };

  return (
    <ExpenseContext.Provider value={expenseContext}>
      {props.children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
