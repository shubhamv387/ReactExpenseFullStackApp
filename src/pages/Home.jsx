import ExpenseForm from './Expenses/ExpenseForm';
import ExpenseList from './Expenses/ExpenseList';
// import UserContext from '../store/user-context';

const Home = () => {
  return (
    <div className='p-6 flex flex-col container max-w-5xl items-center justify-center gap-8'>
      <div className='flex flex-col items-center'>
        <h2 className='text-lg font-semibold text-gray-900 mb-0'>
          Welcome to expense tracker app!
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          Make all your expenses of your pocket size.
        </p>
      </div>

      <ExpenseForm />
      <ExpenseList />
    </div>
  );
};

export default Home;
