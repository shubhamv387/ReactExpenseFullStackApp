import { useNavigate } from 'react-router-dom';
import Input from '../components/UI/Input';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { AuthActions } from '../redux/authSlice';
import { updateProfileHandler } from '../redux/userSlice';
import { sendEmailVerificationCode } from '../services/userServices';
import { STATUS } from '../redux/helper';
import { Loader } from '../components/UI/Loader';

const Profile = () => {
  const authCtx = useSelector((state) => state.auth);
  const userCtx = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(userCtx.status === STATUS.LOADING);
  }, [userCtx.status]);

  const [emailVerifying, setEmailVerifying] = useState(false);
  const [isMailSent, setIsMailSent] = useState(false);

  const navigate = useNavigate();

  const fullNameInputRef = useRef();
  const profileImgUrlInputRef = useRef();

  useEffect(() => {
    fullNameInputRef.current.value = userCtx.userDetails.displayName || '';
    profileImgUrlInputRef.current.value = userCtx.userDetails.photoUrl || '';
  }, [userCtx.userDetails]);

  const submitFormHandler = async (e) => {
    e.preventDefault();

    const enteredFullName = fullNameInputRef.current.value.trim();
    const enteredProfileImgUrl = profileImgUrlInputRef.current.value.trim();

    if (enteredFullName.length < 1 || enteredProfileImgUrl < 1)
      return toast.warn('All fields are required!');

    // const imgExtension = new Set(['png', 'jpg', 'jpeg', 'webp']);
    // const photoUrlExtension = enteredProfileImgUrl.split('.');

    // if (imgExtension.has(photoUrlExtension[photoUrlExtension.length - 1])) {
    //   console.log(enteredProfileImgUrl);
    // } else return alert('file format does not supports!');

    const formData = {
      idToken: authCtx.token,
      displayName: enteredFullName,
      photoUrl: enteredProfileImgUrl,
      returnSecureToken: true,
    };

    // await userCtx.updateProfile(formData);

    dispatch(updateProfileHandler(formData, authCtx.token));

    !authCtx.isProfileCompleted &&
      dispatch(AuthActions.setIsProfileCompleted(true));
  };

  const emailVerificationHandler = async () => {
    setEmailVerifying(true);
    try {
      await sendEmailVerificationCode(authCtx.token);
      toast.success('Successfully sent verification link!');
      setIsMailSent(true);
    } catch (error) {
      const errMsg =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to send verification email!';
      toast.error(errMsg);
      console.log(error);
    } finally {
      setEmailVerifying(false);
    }
  };

  return (
    <div className='flex relative flex-col h-full gap-4 items-center justify-between container px-6 m-10'>
      <div className='flex justify-between items-center w-full max-w-3xl'>
        <h1 className='text-xl font-semibold inline-block'>Update Profile</h1>
        <button
          onClick={() => navigate(-1)}
          className='inline-flex justify-center rounded-lg text-sm font-bold py-1.5 px-4 border-2 text-red-500 border-red-500 hover:border-red-700 hover:bg-red-700 hover:text-white w-fit'
        >
          <span>Cancel</span>
        </button>
      </div>

      <div className='relative w-full flex justify-center'>
        {isLoading && (
          <div className='absolute z-50 flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-white'>
            <Loader className='p-5 border-[6px] border-blue-500' />
          </div>
        )}
        <form onSubmit={submitFormHandler} className='w-full max-w-sm mt-20'>
          <div className='mb-6'>
            <div className='flex justify-between items-center'>
              <label className='block text-sm font-semibold w-fit leading-6 text-gray-900 cursor-pointer'>
                Email
              </label>

              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  !userCtx.userDetails.emailVerified
                    ? 'bg-red-50 text-red-700'
                    : 'bg-green-50 text-green-700'
                } ring-1 ring-inset ring-red-600/10 ms-2 me-auto`}
              >
                {!userCtx.userDetails.emailVerified
                  ? 'Not Verified'
                  : 'Verified'}
              </span>

              {!userCtx.userDetails.emailVerified &&
                (!isMailSent ? (
                  <button
                    type='button'
                    disabled={emailVerifying}
                    className='text-blue-600 inline-flex justify-center rounded-md text-sm font-medium hover:text-blue-800'
                    onClick={emailVerificationHandler}
                  >
                    {!emailVerifying ? (
                      <span className='font-bold'>Verify now</span>
                    ) : (
                      <>
                        <div className='h-5 w-5 mr-3 rounded-full animate-spin border-2 border-solid border-green-400 border-t-transparent' />
                        <span>Sending request...</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                    Successfully sent!
                  </span>
                ))}
            </div>

            <input
              type='email'
              disabled={true}
              name='email'
              placeholder={userCtx.userDetails.email}
              className={`mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200`}
            />
          </div>

          <Input
            label={'Full Name'}
            input={{
              type: 'text',
              name: 'fullName',
              ref: fullNameInputRef,
              id: 'fullName',
              placeholder: 'John Doe',
            }}
          />
          <Input
            label={'Profile Photo Url'}
            input={{
              type: 'text',
              name: 'profileImgUrl',
              ref: profileImgUrlInputRef,
              id: 'profileImgUrl',
              placeholder: 'https://ptofilephotourl.png',
            }}
          />
          <button
            disabled={isLoading}
            type='submit'
            className='inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full disabled:bg-slate-700'
          >
            {!isLoading ? (
              <span>Update profile</span>
            ) : (
              <>
                <div className='h-5 w-5 mr-3 rounded-full animate-spin border-2 border-solid border-yellow-400 border-t-transparent' />
                <span>Processing...</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
