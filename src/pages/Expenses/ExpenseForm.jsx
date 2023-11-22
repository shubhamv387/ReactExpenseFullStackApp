import { useState, useEffect, useRef } from 'react';
import { STATUS } from '../../store/helper';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addExpenseHandler,
  updateExpenseHandler,
} from '../../store/expenseSlice';
import DropDown from './DropDown';
import { toast } from 'react-toastify';

const ExpenseForm = (props) => {
  const dispatch = useDispatch();
  const authCtx = useSelector((state) => state.auth);
  const { status, totalExpenseAmount, expenses } = useSelector(
    (state) => state.expense
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(status === STATUS.LOADING);
  }, [status]);

  const amountInputRef = useRef();

  const [isOpenedForm, setIsOpenedForm] = useState(false);
  const [displayPremiumFeatures, setDisplayPremiumFeatures] = useState(false);

  const { editMode } = props;
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    let tId;
    if (editMode) {
      const expense = expenses.find((item) => item.id === id);

      if (expense) {
        const { amount, description, category } = expense;
        setFormData({ amount, description, category });
        setIsOpenedForm(true);
        tId = setTimeout(() => amountInputRef.current?.focus(), 10);
      }
    } else {
      setFormData({ amount: '', description: '', category: '' });
      setIsOpenedForm(false);
    }

    return () => tId && clearTimeout(tId);
  }, [id, expenses]);

  const inputHandler = (e) => {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const submitFormHandler = (e) => {
    e.preventDefault();

    const regexPattern = /^[0-9]+(\.[0-9]+)?$/;

    if (!regexPattern.test(formData.amount))
      return toast.warn('Amount should a number.');

    const amountInNumber = parseFloat(formData.amount);
    dispatch(
      addExpenseHandler(
        { ...formData, amount: amountInNumber },
        authCtx.userEmail
      )
    );

    setFormData({
      amount: '',
      description: '',
      category: '',
    });
  };

  const updateFormHandler = async (e) => {
    e.preventDefault();

    const regexPattern = /^[0-9]+(\.[0-9]+)?$/;

    if (!regexPattern.test(formData.amount))
      return toast.warn('Amount should a number.');

    const amountInNumber = parseFloat(formData.amount);

    dispatch(
      updateExpenseHandler(
        id,
        { ...formData, amount: amountInNumber },
        authCtx.userEmail,
        () => navigate('/')
      )
    );
  };

  const formStatusHandler = () => {
    setIsOpenedForm(!isOpenedForm);
    editMode && navigate('/');
  };

  const activatePremiumBtnHandler = () => {
    setDisplayPremiumFeatures(true);
    toast.success('You are a premium user now!', { position: 'top-center' });
  };

  return (
    <div className='w-full'>
      <div className={`w-full flex items-center justify-between `}>
        <button
          onClick={formStatusHandler}
          type='button'
          className={`w-fit py-2 px-4 text-sm text-white transition-all ${
            !isOpenedForm
              ? 'bg-teal-700 hover:bg-teal-600'
              : 'bg-rose-600 hover:bg-rose-500'
          } rounded-md`}
        >
          {!isOpenedForm ? 'Add Expense' : 'cancel'}
        </button>

        {totalExpenseAmount > 10000 && !displayPremiumFeatures && (
          <button
            onClick={activatePremiumBtnHandler}
            className='w-fit px-4 py-2 text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-md'
            type='button'
          >
            Activate Premium
          </button>
        )}

        {totalExpenseAmount > 10000 && displayPremiumFeatures && (
          <DropDown expenses={expenses} />
        )}
      </div>
      {isOpenedForm && (
        <form
          onSubmit={!editMode ? submitFormHandler : updateFormHandler}
          className='w-full px-5 py-6 md:py-10 md:px-7 shadow-md border rounded-xl mt-6'
        >
          <div className=' border-gray-900/10 flex items-center justify-center'>
            <div className='grid grid-cols-4 gap-x-3 gap-y-3 w-full'>
              <div className='col-span-4 md:col-span-2 lg:col-span-1 '>
                <label
                  htmlFor='amount'
                  className='block text-sm font-semibold w-fit leading-6 text-gray-900 cursor-pointer'
                >
                  Amount
                </label>

                <input
                  ref={amountInputRef}
                  onChange={inputHandler}
                  value={formData.amount}
                  required
                  name='amount'
                  id='amount'
                  type='text'
                  placeholder='expense amount here...'
                  className={`mt-1 text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200`}
                />
              </div>

              <div className='col-span-4 md:col-span-2 lg:col-span-1'>
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
                  className={`mt-1 text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200`}
                />
              </div>

              <div className='col-span-4 md:col-span-2 lg:col-span-1'>
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
                  className={`mt-1 text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200`}
                >
                  <option disabled value=''>
                    Select Category
                  </option>
                  <option value='Food'>Food</option>
                  <option value='Fuel'>Fuel</option>
                  <option value='Health'>Health</option>
                </select>
              </div>

              <div className='col-span-4 flex items-end  md:col-span-2 lg:col-span-1'>
                <button
                  disabled={isLoading}
                  type='submit'
                  className='inline-flex h-fit justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full disabled:bg-slate-700'
                >
                  {!isLoading ? (
                    <span>{!editMode ? 'Add Expense' : 'Update Expense'}</span>
                  ) : (
                    <>
                      <div className='h-5 w-5 mr-3 rounded-full animate-spin border-2 border-solid border-yellow-400 border-t-transparent' />
                      <span>
                        {!editMode
                          ? 'Adding Expense...'
                          : 'Updating Expense...'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExpenseForm;
