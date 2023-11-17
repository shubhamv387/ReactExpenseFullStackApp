import { useContext } from 'react';
import UserContext from '../store/user-context';

const Home = () => {
  const userCtx = useContext(UserContext);

  return (
    <div className='py-20 flex flex-col items-center gap-10'>
      <h1 className='text-3xl font-bold'>Welcome to expense tracker app!!!</h1>

      {userCtx.userDetails.emailVerified !== undefined &&
        !userCtx.userDetails.emailVerified && (
          <button
            className='ring-2 text-white ring-slate-900 bg-slate-900 hover:bg-slate-700 hover:ring-slate-700 px-3 py-1.5 rounded-sm'
            onClick={userCtx.emailVerification}
          >
            Get Email Verification Link
          </button>
        )}
    </div>
  );
};

export default Home;
