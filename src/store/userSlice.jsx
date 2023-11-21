import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from './helper';
import {
  getUserData,
  sendEmailVerificationCode,
  updateProfile,
} from '../services/userServices';
import { toast } from 'react-toastify';

const initialUserState = {
  userDetails: { emailVerified: false },
  status: STATUS.IDLE,
};

const userSlice = createSlice({
  name: 'user',

  initialState: initialUserState,

  reducers: {
    getUserDetails(state, action) {
      state.userDetails = action.payload;
    },

    updateProfile(state, action) {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },

    resetUserData(state) {
      return initialUserState;
    },

    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const UserActions = userSlice.actions;

export default userSlice.reducer;

// Thunks
export const getUserDataHandler = (token) => {
  return async (dispatch, getState) => {
    dispatch(UserActions.setStatus(STATUS.LOADING));
    try {
      const { data } = await getUserData(token);

      if (data.users.length > 0) {
        const userDetails = {
          displayName: data.users[0].displayName,
          email: data.users[0].email,
          emailVerified: data.users[0].emailVerified,
          photoUrl: data.users[0].photoUrl,
        };

        dispatch(UserActions.getUserDetails(userDetails));
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to get user data!';
      toast.error(errMsg);
      console.log(error);
    } finally {
      dispatch(UserActions.setStatus(STATUS.IDLE));
    }
  };
};

export const updateProfileHandler = (formData, token) => {
  return async function updateProfileThunk(dispatch, getState) {
    dispatch(UserActions.setStatus(STATUS.LOADING));
    try {
      const { data } = await updateProfile(formData, token);

      // console.log(data);

      const updatedUserDetails = {
        displayName: data.displayName,
        email: data.email,
        emailVerified: data.emailVerified,
        photoUrl: data.photoUrl,
      };

      dispatch(UserActions.updateProfile(updatedUserDetails));
      toast.success('Profile updated!');
      dispatch(UserActions.setStatus(STATUS.SUCCESS));
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to update profile!';
      toast.error(errMsg);
      console.log(error);
      dispatch(UserActions.setStatus(STATUS.ERROR));
    } finally {
      dispatch(UserActions.setStatus(STATUS.IDLE));
    }
  };
};

export const sendEmailVerificationHandler = (token) => {
  return async function EmailVerificationThunk(dispatch, getState) {
    dispatch(UserActions.setStatus(STATUS.LOADING));
    try {
      // throw new Error('custom error');
      await sendEmailVerificationCode(token);
      dispatch(UserActions.emailVerification());
      toast.success('Successfully sent verification link!');
      dispatch(UserActions.setStatus(STATUS.SUCCESS));
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to send verification email!';
      toast.error(errMsg);
      console.log(error);
      dispatch(UserActions.setStatus(STATUS.ERROR));
    } finally {
      dispatch(UserActions.setStatus(STATUS.IDLE));
    }
  };
};
