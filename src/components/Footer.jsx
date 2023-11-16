const Footer = () => {
  return (
    <footer className='wrapper bg-slate-900 fixed bottom-0 left-0 right-0'>
      <div className='flex items-center justify-center container p-6'>
        <p className='text-lg mb-0 text-white'>
          {`Expense Tracker App | Copyright © ${new Date(
            Date.now()
          ).getFullYear()} | All Rights Reserved`}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
