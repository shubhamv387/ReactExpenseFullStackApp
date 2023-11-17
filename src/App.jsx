import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import { useContext } from 'react';
import AuthContext from './store/auth-context';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const authCtx = useContext(AuthContext);

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

  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<ProtectedRoute element={<Home />} />} />
        <Route path='/login' element={<LoggedInRoute element={<Login />} />} />
        <Route
          path='/forgot-password'
          element={<LoggedInRoute element={<ForgotPassword />} />}
        />
        <Route
          path='/register'
          element={<LoggedInRoute element={<Register />} />}
        />
        <Route path='/shop' element={<Shop />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/profile'>
          <Route index element={<ProtectedRoute element={<Profile />} />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
