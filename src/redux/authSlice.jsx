import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token') || null;

const initialAuthState = {
  token,
  isLoggedIn: !!token,
  isProfileCompleted: localStorage.getItem('isProfileCompleted') || false,
  userEmail: localStorage.getItem('userEmail') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setIsProfileCompleted(state, action) {
      localStorage.setItem(
        'isProfileCompleted',
        JSON.stringify(action.payload)
      );
      state.isProfileCompleted = action.payload; //token
    },

    login(state, action) {
      localStorage.setItem('token', action.payload.token); //token
      state.token = action.payload.token; //token
      state.isLoggedIn = true;

      const newUserEmail = action.payload.userEmail
        .replace(/@/g, '')
        .replace(/\./g, '');

      localStorage.setItem('userEmail', newUserEmail);
      state.userEmail = newUserEmail;
      localStorage.setItem('expiresIn', Date.now());
    },

    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('isProfileCompleted');
      state.userEmail = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const AuthActions = authSlice.actions;

export default authSlice.reducer;
