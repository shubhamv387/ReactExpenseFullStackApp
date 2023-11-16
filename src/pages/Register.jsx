import { Link, useNavigate } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';
import Input from '../components/UI/Input';
import AuthContext from '../store/auth-context';

const Auth = () => {
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);
  // console.log(authCtx);

  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPassInputRef = useRef();

  const submitFormHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value.trim();
    const enteredPassword = passwordInputRef.current.value.trim();
    const enteredConfirmPass = confirmPassInputRef.current.value.trim();

    if (
      enteredEmail.length < 1 ||
      enteredPassword.length < 1 ||
      enteredConfirmPass.length < 1
    ) {
      return alert('All fields required!');
    }
    if (enteredPassword.length < 6)
      return alert('password must be of 6 characters!');

    if (enteredPassword !== enteredConfirmPass) {
      passwordInputRef.current.value = '';
      confirmPassInputRef.current.value = '';
      return alert('password does not matches!');
    }

    const formData = {
      email: enteredEmail,
      password: enteredPassword,
      confirmPass: enteredConfirmPass,
    };

    console.log(formData);

    setIsLoading(true);

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
      import.meta.env.VITE_FIREBASE_API_KEY
    }`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      // setIsLoading(false);

      if (!res.ok) {
        let errorMessage = 'Authentication Failed!';
        if (data && data.error && data.error.message)
          errorMessage = data.error.message;

        throw new Error(errorMessage);
      }

      authCtx.login(data.idToken);

      navigate('/');

      emailInputRef.current.value = '';
      passwordInputRef.current.value = '';
      confirmPassInputRef.current.value = '';
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative w-full h-full flex flex-1 flex-col overflow-hidden px-4 py-20 sm:px-6 lg:px-8'>
      <div className='relative flex flex-1 flex-col items-center justify-center pb-20 '>
        <h1 className='flex self-center font-semibold text-xl mb-[70px] '>
          Register
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
          />

          <Input
            label={'Confirm Password'}
            input={{
              type: 'password',
              name: 'confirmPassword',
              id: 'confirmPassword',
              ref: confirmPassInputRef,
            }}
          />
          {!isLoading ? (
            <button
              type='submit'
              className='inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full'
            >
              <span>Create a new account</span>
            </button>
          ) : (
            <h5 className='text-xl font-bold p-[6px]'>Sending Request...</h5>
          )}
        </form>
      </div>
      <div className='relative shrink-0'>
        <div className='text-sm text-gray-900 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5'>
          <p className='text-center inline-flex sm:text-left mb-0'>
            Already have an account?
          </p>
          <Link
            className='inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 text-slate-900 ring-1 ring-slate-900/10 hover:ring-slate-900/20'
            to={'/login'}
          >
            <span>
              Login &nbsp;
              <span aria-hidden='true'>&rarr;</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
