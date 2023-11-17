import { useState, useContext } from 'react';
import ExpenseContext from '../../store/expense-context';

const ExpenseForm = () => {
  const expenseCtx = useContext(ExpenseContext);

  //   console.log(expenseCtx);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
  });

  const inputHandler = (e) => {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const submitFormHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      expenseCtx.addExpense({ id: Date.now().toString(), ...formData });
      setIsLoading(false);
    }, 1500);
    setFormData({
      amount: '',
      description: '',
      category: '',
    });
  };

  return (
    <form onSubmit={submitFormHandler} className='w-full'>
      <div className='space-y-12'>
        <div className='border-b border-gray-900/10 pb-12'>
          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4 '>
            <div className='sm:col-span-1'>
              <label
                htmlFor='amount'
                className='block text-sm font-semibold w-fit leading-6 text-gray-900 cursor-pointer'
              >
                Amount
              </label>

              <input
                onChange={inputHandler}
                value={formData.amount}
                required
                name='amount'
                id='amount'
                type='text'
                placeholder='expense amount here...'
                className={`mt-2 text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200`}
              />
            </div>

            <div className='sm:col-span-1'>
              <label
                htmlFor='description'
                className='block text-sm font-semibold w-fit leading-6 text-gray-900 cursor-pointer'
              >
                Description
              </label>

              <input
                onChange={inputHandler}
                value={formData.description}
                required
                name='description'
                id='description'
                type='text'
                placeholder='expense description here...'
                className={`mt-2 text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200`}
              />
            </div>

            <div className='sm:col-span-1'>
              <label
                htmlFor='category'
                className='block text-sm font-semibold w-fit leading-6 text-gray-900 cursor-pointer'
              >
                Category
              </label>

              <select
                onChange={inputHandler}
                value={formData.category}
                required
                name='category'
                id='category'
                className={`mt-2 text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200`}
              >
                <option disabled value=''>
                  Select Category
                </option>
                <option value='Food'>Food</option>
                <option value='Fuel'>Fuel</option>
                <option value='Health'>Health</option>
              </select>
            </div>

            <div className='sm:col-span-1 flex items-end'>
              <button
                disabled={isLoading}
                type='submit'
                className='inline-flex h-fit justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full disabled:bg-slate-700'
              >
                {!isLoading ? (
                  <span>Add Expense</span>
                ) : (
                  <>
                    <div className='h-5 w-5 mr-3 rounded-full animate-spin border-2 border-solid border-yellow-400 border-t-transparent' />
                    <span>Adding Expense...</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ExpenseForm;
