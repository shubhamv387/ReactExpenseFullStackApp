import { useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import { useContext, useEffect, useRef } from 'react';
import AuthContext from '../../store/auth-context';
import UserContext from '../../store/user-context';

const UpdateProfile = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  // console.log(userCtx);

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
      return alert('All fields are required!');

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

    userCtx.updateProfile(formData);
  };

  return (
    <div className='flex flex-col h-full gap-4 items-center justify-between container px-6 m-10'>
      <div className='flex justify-between items-center w-full max-w-3xl'>
        <h1 className='text-xl font-semibold inline-block'>Update Profile</h1>
        <button
          onClick={() => navigate(-1)}
          className='inline-flex justify-center rounded-lg text-sm font-bold py-1.5 px-4 border-2 text-red-500 border-red-500 hover:border-red-700 hover:bg-red-700 hover:text-white w-fit'
        >
          <span>Cancel</span>
        </button>
      </div>
      <form onSubmit={submitFormHandler} className='w-full max-w-sm mt-20'>
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
          type='submit'
          className='inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full'
        >
          <span>Update Profile</span>
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
