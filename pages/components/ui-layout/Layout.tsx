import Link from "next/link";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="mt-8 p-2 sm:p-4 flex justify-center w-full">
    <div className="mx-2 sm:mx-12 lg:w-2/3  overflow-hidden  ">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="super-title">fintrackr</h1>
        </div>
        <div className="flex  text-lg font-bold mt-3 ">
          <Link href="/expenses">
            <a className="mr-4 hover:text-indigo-800">Expenses</a>
          </Link>
          <Link href="/revenue">
            <a className="hover:text-indigo-800">Revenue</a>
          </Link>
        </div>
      </div>

      {children}
    </div>
  </div>
);

export default Layout;
