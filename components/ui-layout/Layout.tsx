import Link from "next/link";
import { ReactNode } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";

type LayoutProps = {
  children: ReactNode;
};


const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className=" dur  mt-8 p-2 sm:p-4 flex justify-center w-full">
    <div className="mx-2 w-full sm:mx-12 lg:w-2/3  overflow-hidden  ">
      <div className="flex mb-4 flex-row justify-between">
        <div>
          <Link href="/expenses">
            <a>
              <h1 className=" text-center md:text-left super-title">
                fintrackr
              </h1>
            </a>
          </Link>
        </div>
        <div className="flex justify-center md:justify-start text-lg font-bold md:mt-3 ">
          <Link href="/expenses">
            <a className=" mr-4 hover:text-indigo-800 flex  items-center">
              Expenses
            </a>
          </Link>


          <SignedIn>
            <div className="ml-4 mt-2 mr-1">
              <UserButton userProfileURL="/user" afterSignOutAll="/" />
            </div>
          </SignedIn>
        </div>
      </div>


      {children}
    </div>
  </div>
);

export default Layout;
