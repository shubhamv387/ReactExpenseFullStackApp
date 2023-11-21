import { configureStore } from '@reduxjs/toolkit';
import AuthReducers from './authSlice';
import UserReducers from './userSlice';
import ExpenseReducers from './expenseSlice';

const store = configureStore({
  reducer: {
    auth: AuthReducers,
    user: UserReducers,
    expense: ExpenseReducers,
  },
});

export default store;
