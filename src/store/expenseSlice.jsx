import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from './helper';
import { toast } from 'react-toastify';
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from '../services/expenseServices';

const initialExpenseState = {
  expenses: [],
  totalExpenseAmount: 0,
  status: STATUS.IDLE,
};

const expenseSlice = createSlice({
  name: 'expense',

  initialState: initialExpenseState,

  reducers: {
    getAllExpenses(state, action) {
      state.expenses = action.payload.expenses;
      state.totalExpenseAmount = action.payload.totalExpenseAmount;
    },

    addExpense(state, action) {
      state.expenses = state.expenses.concat(action.payload);
      state.totalExpenseAmount =
        state.totalExpenseAmount + +action.payload.amount;
    },

    updateExpense(state, action) {
      const expenseIndex = state.expenses.findIndex(
        (item) => item.id === action.payload.id
      );
      const expense = state.expenses[expenseIndex];

      if (expense) {
        let updatedExpense = { ...expense, ...action.payload.expense };
        state.expenses[expenseIndex] = updatedExpense;

        state.totalExpenseAmount =
          state.totalExpenseAmount -
          expense.amount +
          +action.payload.expense.amount;
      }
    },

    deleteExpense(state, action) {
      const updatedExpenses = state.expenses.filter(
        (item) => item.id !== action.payload.id
      );

      const expense = state.expenses.find((i) => i.id === action.payload.id);
      const totalAmount = state.totalExpenseAmount - expense.amount;

      state.expenses = updatedExpenses;
      state.totalExpenseAmount = totalAmount;
    },

    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const ExpenseActions = expenseSlice.actions;

export default expenseSlice.reducer;

// thunk
export const getAllExpensesHandler = (userEmail) => {
  return async (dispatch, getState) => {
    dispatch(ExpenseActions.setStatus(STATUS.LOADING));
    try {
      const { data } = await getExpenses(userEmail);
      const expenses = [];
      let totalExpenseAmount = 0;

      if (data) {
        for (const [key, value] of Object.entries(data)) {
          expenses.push({ id: key, ...value });
          totalExpenseAmount += +value.amount;
        }
      }
      dispatch(ExpenseActions.getAllExpenses({ expenses, totalExpenseAmount }));
      dispatch(ExpenseActions.setStatus(STATUS.IDLE));
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to get user expenses!';
      toast.error(errMsg);
      console.log(error);
      dispatch(ExpenseActions.setStatus(STATUS.ERROR));
    }
  };
};

export const addExpenseHandler = (expense, userEmail) => {
  return async (dispatch, getState) => {
    dispatch(ExpenseActions.setStatus(STATUS.LOADING));
    try {
      const {
        data: { name: id },
      } = await addExpense(expense, userEmail);

      dispatch(ExpenseActions.addExpense({ id, ...expense }));
      dispatch(ExpenseActions.setStatus(STATUS.IDLE));
      toast.success('Expense added successfully!');
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to add new expense!';
      toast.error(errMsg);
      console.log(error);
      dispatch(ExpenseActions.setStatus(STATUS.ERROR));
    }
  };
};

export const updateExpenseHandler = (id, expense, userEmail, cb) => {
  return async (dispatch, getState) => {
    dispatch(ExpenseActions.setStatus(STATUS.LOADING));
    try {
      const { data } = await updateExpense(id, expense, userEmail);

      dispatch(ExpenseActions.updateExpense({ id, expense: data }));
      dispatch(ExpenseActions.setStatus(STATUS.IDLE));
      toast.success('Expense updated successfully!');
      cb();
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to update expense!';
      toast.error(errMsg);
      console.log(error);
      dispatch(ExpenseActions.setStatus(STATUS.ERROR));
    }
  };
};

export const deleteExpenseThunk = (id, userEmail) => {
  return async (dispatch, getState) => {
    dispatch(ExpenseActions.setStatus(STATUS.LOADING));
    try {
      await deleteExpense(id, userEmail);

      dispatch(ExpenseActions.deleteExpense({ id }));
      dispatch(ExpenseActions.setStatus(STATUS.IDLE));
      toast.success('Expense deleted successfully!');
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to delete expense!';
      toast.error(errMsg);
      console.log(error);
      dispatch(ExpenseActions.setStatus(STATUS.ERROR));
    }
  };
};
