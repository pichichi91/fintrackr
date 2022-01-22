import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Transition } from "@headlessui/react";

type LayoutProps = {
  children: ReactNode;
};


const Layout: React.FC<LayoutProps> = ({ children }) => {


  return(
  <div className=" dur  mt-8 p-2 sm:p-4 flex justify-center w-full">
    <div className="mx-2 w-full sm:mx-12 lg:w-2/3  overflow-hidden  ">
    <Transition
    show={true}
    appear={true}
    enter="transition-opacity duration-500 ease-in"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition-opacity duration-200 ease-in"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
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
      </Transition>


      {children}
    </div>
  </div>
)};

export default Layout;
