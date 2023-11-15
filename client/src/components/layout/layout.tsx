import Header from "./header/Header";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      
        <div className="flex md:px-8">
          <Header />
          {children}
      </div>
    </>
  );
};

export default Layout;
