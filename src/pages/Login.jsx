import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import Input from '../components/UI/Input';
// import AuthContext from '../store/auth-context';
import { loginUser } from '../services/authServices';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AuthActions } from '../store/authSlice';

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const authCtx = useContext(AuthContext);
  //   console.log(authCtx);

  const [isLoading, setIsLoading] = useState(false);
  const [isShownPass, setIsShownPass] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const setIsShownPassHandler = () => {
    setIsShownPass(!isShownPass);

    !isShownPass
      ? (passwordInputRef.current.type = 'text')
      : (passwordInputRef.current.type = 'password');
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value.trim();
    const enteredPassword = passwordInputRef.current.value.trim();

    // eslint-disable-next-line no-unused-vars
    const regexPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\0-9)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (enteredEmail.length < 1 || enteredPassword.length < 1) {
      return toast.warn('All fields required!');
    }

    setIsLoading(true);

    try {
      const { data } = await loginUser({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      });

      // authCtx.login(data.idToken, data.email);

      dispatch(
        AuthActions.login({ token: data.idToken, userEmail: data.email })
      );

      if (data.displayName.length > 0)
        dispatch(AuthActions.setIsProfileCompleted(true));
      else dispatch(AuthActions.setIsProfileCompleted(false));

      toast.success('login successful');
      navigate('/');

      emailInputRef.current.value = '';
      passwordInputRef.current.value = '';
    } catch (error) {
      console.log(error);
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Login failed!';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='relative w-full h-full flex flex-1 flex-col overflow-hidden px-4 py-20 sm:px-6 lg:px-8 '>
      <div className='relative flex flex-1 flex-col items-center justify-center '>
        <h1 className='flex self-center font-semibold text-xl mb-[70px] '>
          Login
        </h1>
        <form onSubmit={submitFormHandler} className='w-full max-w-sm'>
          <Input
            label={'Email address'}
            input={{
              type: 'email',
              name: 'email',
              id: 'email',
              ref: emailInputRef,
            }}
          />

          <Input
            label={'Password'}
            input={{
              type: 'password',
              name: 'password',
              id: 'password',
              ref: passwordInputRef,
            }}
            isShownPass={isShownPass}
            setIsShownPass={setIsShownPassHandler}
          />

          <button
            disabled={isLoading}
            type='submit'
            className='inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full disabled:bg-slate-700'
          >
            {!isLoading ? (
              <span>Log in to account</span>
            ) : (
              <>
                <div className='h-5 w-5 mr-3 rounded-full animate-spin border-2 border-solid border-yellow-400 border-t-transparent' />
                <span>Sending Request...</span>
              </>
            )}
          </button>
          <p className='mt-8 text-center'>
            <Link to='/forgot-password' className='text-sm hover:underline'>
              Forgot password?
            </Link>
          </p>
        </form>
      </div>

      <div className='flex flex-col m-10 gap-3 items-center justify-center'>
        <div className='flex flex-col'>
          <p>
            <span className='font-bold'>Test Email:</span> testuser@test.com
          </p>
          <p>
            <span className='font-bold'>Password:</span> Test##123
          </p>
        </div>
      </div>

      <div className='relative shrink-0'>
        <div className='text-sm text-gray-900 flex items-center justify-center gap-3 md:gap-5'>
          <p className='text-center inline-flex sm:text-left mb-0'>
            Don&apos;t have an account?
          </p>
          <Link
            className='inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 text-slate-900 ring-1 ring-slate-900/10 hover:ring-slate-900/20'
            to='/register'
          >
            <span>
              Register &nbsp;
              <span aria-hidden='true'>&rarr;</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Auth;
