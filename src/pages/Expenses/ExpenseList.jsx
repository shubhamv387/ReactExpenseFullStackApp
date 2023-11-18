import { useContext, useState } from 'react';
import ExpenseContext from '../../store/expense-context';
import ExpenseModel from './ExpenseModel';
import Loader from '../../components/UI/Loader';

const ExpenseList = () => {
  const expenseCtx = useContext(ExpenseContext);

  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  let content = (
    <h3 className='text-center text-xl font-bold'>No Expense found...</h3>
  );

  if (expenseCtx.expenses.length > 0)
    content = expenseCtx.expenses.map((expense) => (
      <ExpenseModel key={expense.id} expense={expense} />
    ));

  return (
    <div className='flex flex-col items-center w-full gap-3 mt-2 md:mt-4'>
      {!isLoading ? (
        content
      ) : (
        <Loader height={12} width={12} borderWidth={8} borderColor={'blue'} />
      )}
    </div>
  );
};

export default ExpenseList;
