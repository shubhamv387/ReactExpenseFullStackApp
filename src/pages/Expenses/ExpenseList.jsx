import { useContext } from 'react';
import ExpenseContext from '../../store/expense-context';

const ExpenseList = (props) => {
  const expenseCtx = useContext(ExpenseContext);

  console.log(expenseCtx.expenses);

  return (
    <div>
      {expenseCtx.expenses.map((expense) => (
        <div key={expense.id} className='flex w-full gap-10'>
          <p>{expense.amount}</p>
          <p>{expense.description}</p>
          <p>{expense.category}</p>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
