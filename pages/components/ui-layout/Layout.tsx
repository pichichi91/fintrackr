import Link from "next/link";
import { ReactNode } from "react";
import {RiCommandFill} from 'react-icons/ri'
type LayoutProps = {
  children: ReactNode;
};

const showCommandPalette = () => {
  console.log('commandPallette')
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="mt-8 p-2 sm:p-4 flex justify-center w-full">
    <div className="mx-2 sm:mx-12 lg:w-2/3  overflow-hidden  ">
      <div className="flex mb-12 flex-col md:flex-row justify-between">
        <div>
          <h1 className=" text-center md:text-left super-title">fintrackr</h1>
        </div>
        <div className="flex justify-center md:justify-start text-lg font-bold mt-3 ">
          <Link href="/expenses">
            <a className="mr-4 hover:text-indigo-800 flex  items-center">Expenses</a>
          </Link>
          <Link href="/revenue">
            <a className="hover:text-indigo-800 flex  items-center ">Revenue</a>
          </Link>
          <button onClick={showCommandPalette} className="m-0 ml-4  mr-1 bg-slate-100 p-2 shadow-md">
            <RiCommandFill className="fill-indigo-700 " size={30} />
          </button>
        </div>
      </div>

      {children}
    </div>
  </div>
);

export default Layout;
