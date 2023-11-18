import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='wrapper mb-auto'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
