import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ExpenseForm from './Expenses/ExpenseForm';
import ExpenseList from './Expenses/ExpenseList';
import { getAllExpensesHandler } from '../store/expenseSlice';

const Home = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let editMode = false;
  editMode = query.get('editMode');

  const { isLoggedIn, userEmail } = useSelector((state) => state.auth);
  const { totalExpenseAmount } = useSelector((state) => state.expense);
  const dispatch = useDispatch();

  useEffect(() => {
    const tId = setTimeout(
      () => isLoggedIn && dispatch(getAllExpensesHandler(userEmail)),
      30
    );

    return () => clearTimeout(tId);
  }, [isLoggedIn, userEmail]);

  // console.log(editMode);
  return (
    <div className='p-6 flex flex-col container max-w-5xl items-center justify-center gap-8'>
      <div className='flex flex-col items-center'>
        <h2 className='text-lg font-semibold text-gray-900 mb-0'>
          Welcome to expense tracker app!
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          Make all your expenses of your pocket size.
        </p>
        ,
        {totalExpenseAmount > 10000 && (
          <button
            className='px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md'
            type='button'
          >
            Activate Premium
          </button>
        )}
      </div>

      <ExpenseForm editMode={editMode === 'true' ? true : false} />
      <ExpenseList />
    </div>
  );
};

export default Home;
