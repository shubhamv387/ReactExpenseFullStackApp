import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: null,
  isLoggedIn: false,
  isProfileCompleted: false,
  setIsProfileCompleted: (boolean) => {},
  login: (token) => {},
  logout: () => {},
});

export const AuthProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const initialIsProfileCompleted = localStorage.getItem('isProfileCompleted');

  const [token, setToken] = useState(initialToken);
  const [isProfileCompleted, setIsProfileCompleted] = useState(
    JSON.parse(initialIsProfileCompleted)
  );

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const profileUpdateHandler = (boolean) => {
    localStorage.setItem('isProfileCompleted', JSON.stringify(boolean));
    setIsProfileCompleted(boolean);
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isProfileCompleted');
    setToken(null);
  };

  const authContext = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    isProfileCompleted: isProfileCompleted,
    setIsProfileCompleted: profileUpdateHandler,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
