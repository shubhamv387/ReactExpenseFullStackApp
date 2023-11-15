import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <>
      <Header />
      <main className='wrapper '>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
