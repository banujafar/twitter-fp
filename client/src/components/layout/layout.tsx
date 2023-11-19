import Header from './header/Header';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="container xxs:max-w-full xs:max-w-full sm:max-w-[576px] md:max-w-[768px] lg:max-w-[992px] xl:max-w-[1200px]   mx-auto xl:mx-auto lg:mx-auto md:mx-auto sm:mx-auto xs:mx-0">
        <div className="flex justify-center">
          <Header />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
