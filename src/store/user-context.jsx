import React, { useEffect, useReducer, useContext } from 'react';
import {
  getUserData,
  sendEmailVerificationCode,
  updateProfile,
} from '../services/userServices';
import AuthContext from './auth-context';

const UserContext = React.createContext({
  userDetails: { emailVerified: false },
  updateProfile: async (formData) => {},
  emailVerification: async () => {},
});

const initialUserDetails = { emailVerified: false };

const userReducer = (state, action) => {
  if (action.type === 'GET_USER_DETAILS') {
    return { ...state, ...action.userDetails };
  }

  if (action.type === 'UPDATE_PROFILE') {
    return { ...state, ...action.updatedUserDetails };
  }

  if (action.type === 'EMAIL_VERIFICATION') {
    return { ...state, emailVerified: action.emailVerified };
  }

  if (action.type === 'LOGOUT') {
    return initialUserDetails;
  }

  return state;
};

export const UserProvider = (props) => {
  const authCtx = useContext(AuthContext);

  const [userState, userDispatch] = useReducer(userReducer, initialUserDetails);

  useEffect(() => {
    if (authCtx.token) {
      getUserData(authCtx.token)
        .then(({ success, userDetails }) => {
          //   console.log(userDetails);
          if (success)
            userDispatch({
              type: 'GET_USER_DETAILS',
              userDetails: userDetails,
            });
        })
        .catch((err) => console.log(err.message));
    } else userDispatch({ type: 'LOGOUT' });
  }, [authCtx.isLoggedIn]);

  const updateProfileHandler = async (formData) => {
    try {
      const { success, updatedUserDetails } = await updateProfile({
        ...formData,
        idToken: authCtx.token,
      });
      //   console.log(updatedUserDetails);

      if (success) {
        alert('Profile updated!');
        userDispatch({
          type: 'UPDATE_PROFILE',
          updatedUserDetails: updatedUserDetails,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const emailVerificationHandler = async () => {
    try {
      const { success } = await sendEmailVerificationCode(authCtx.token);
      // console.log(data);
      if (success) {
        // userDispatch({ type: 'EMAIL_VERIFICATION', emailVerified: true });
        alert('Successfully sent verification link');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const userContext = {
    userDetails: userState,
    updateProfile: updateProfileHandler,
    emailVerification: emailVerificationHandler,
  };
  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
