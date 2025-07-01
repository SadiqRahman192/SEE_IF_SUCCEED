<<<<<<< HEAD
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-4 md:mx-12 lg:mx-24"> {/* horizontal margin */}
      {children}
    </div>
  );
};

export default Layout;
=======
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className=""> {/* horizontal margin */}
      {children}
    </div>
  );
};

export default Layout;
>>>>>>> e698f63 (enhance and bunch of features to the app)
