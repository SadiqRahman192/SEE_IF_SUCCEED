import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-4 md:mx-12 lg:mx-24"> {/* horizontal margin */}
      {children}
    </div>
  );
};

export default Layout;
