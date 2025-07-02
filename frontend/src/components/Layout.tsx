import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className=""> {/* horizontal margin */}
      {children}
    </div>
  );
};

export default Layout;
