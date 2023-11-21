import { lazy, Suspense, useEffect } from 'react';

import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

const RootLayout = lazy(() => import('./components/RootLayout.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Shop = lazy(() => import('./pages/Shop.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/UI/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { AuthActions } from './redux/authSlice.jsx';
import { getUserDataHandler } from './redux/userSlice.jsx';

function App() {
  const authCtx = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const timer = 30 * 60 * 1000;
  const timeAtTokenCreated = localStorage.getItem('expiresIn');

  const ProtectedRoute = ({ element }) => {
    if (authCtx.isLoggedIn) {
      return element;
    } else {
      Navigate({ to: '/login' });
      return null;
    }
  };

  const LoggedInRoute = ({ element }) => {
    if (!authCtx.isLoggedIn) {
      return element;
    } else {
      Navigate({ to: '/' });
      return null;
    }
  };

  useEffect(() => {
    const tId = setTimeout(() => {
      if (Object.keys(localStorage).indexOf('expiresIn') !== -1) {
        if (Date.now() - timer > timeAtTokenCreated) {
          dispatch(AuthActions.logout());
          toast.error('Session expired! Login Again', {
            position: 'top-center',
          });
        }
      }
    }, 10);

    return () => clearTimeout(tId);
  }, []);

  useEffect(() => {
    const tId = setTimeout(
      () => authCtx.token && dispatch(getUserDataHandler(authCtx.token)),
      20
    );

    return () => clearTimeout(tId);
  }, [authCtx.token]);

  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
        theme='dark'
        className='md:w-auto md:min-w-[320px]'
      />
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route
            index
            element={
              <ProtectedRoute
                element={
                  <Suspense
                    fallback={
                      <Loader className='p-4 border-4 border-indigo-500' />
                    }
                  >
                    <Home />
                  </Suspense>
                }
              />
            }
          />
          <Route
            path='/expenses/:id'
            element={
              <ProtectedRoute
                element={
                  <Suspense
                    fallback={
                      <Loader className='p-4 border-4 border-indigo-500' />
                    }
                  >
                    <Home />
                  </Suspense>
                }
              />
            }
          />
          <Route
            path='/login'
            element={
              <LoggedInRoute
                element={
                  <Suspense
                    fallback={
                      <Loader className='p-4 border-4 border-indigo-500' />
                    }
                  >
                    <Login />
                  </Suspense>
                }
              />
            }
          />
          <Route
            path='/forgot-password'
            element={
              <LoggedInRoute
                element={
                  <Suspense
                    fallback={
                      <Loader className='p-4 border-4 border-indigo-500' />
                    }
                  >
                    <ForgotPassword />
                  </Suspense>
                }
              />
            }
          />
          <Route
            path='/register'
            element={
              <LoggedInRoute
                element={
                  <Suspense
                    fallback={
                      <Loader className='p-4 border-4 border-indigo-500' />
                    }
                  >
                    <Register />
                  </Suspense>
                }
              />
            }
          />
          <Route
            path='/shop'
            element={
              <Suspense
                fallback={<Loader className='p-4 border-4 border-indigo-500' />}
              >
                <Shop />
              </Suspense>
            }
          />
          <Route
            path='/about'
            element={
              <Suspense
                fallback={<Loader className='p-4 border-4 border-indigo-500' />}
              >
                <About />
              </Suspense>
            }
          />
          <Route
            path='/contact'
            element={
              <Suspense
                fallback={<Loader className='p-4 border-4 border-indigo-500' />}
              >
                <Contact />
              </Suspense>
            }
          />
          <Route path='/profile'>
            <Route
              index
              element={
                <ProtectedRoute
                  element={
                    <Suspense
                      fallback={
                        <Loader className='p-4 border-4 border-indigo-500' />
                      }
                    >
                      <Profile />
                    </Suspense>
                  }
                />
              }
            />
          </Route>
          <Route
            path='*'
            element={
              <Suspense
                fallback={<Loader className='p-4 border-4 border-indigo-500' />}
              >
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
