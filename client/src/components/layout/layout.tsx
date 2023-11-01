import Header from "./header/Header";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="container mx-auto">
        <div className="flex">
          <Header />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
