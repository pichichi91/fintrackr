import UiBadge from "../ui-badge/ui-badge";
import { Transition } from "@headlessui/react";
import dayjs, { Dayjs } from "dayjs";

type CategoryProps = {
  value: number;
  key: string;
};

type ExpenseListingProps = {
  categories: CategoryProps[];
  currency: string;
  addAction?: () => void;
  prognosed: number;
  isLoading: boolean;
  endDate: Dayjs;
  livingCosts: number;
};

const ExpenseListingTable: React.FC<ExpenseListingProps> = ({
  categories,
  currency,
  prognosed,
  isLoading,
  endDate,
  livingCosts
}) => {
  const total = categories?.reduce((i, c) => i + c.value, 0).toFixed(0);

  return (
    <Transition
      show={!isLoading}
      enter="transition-opacity duration-200 ease-in"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200 ease-in"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:mr-6 mb-4 basis-48 font-bold flex flex-col md:flex-col items-start  ">
          <div className=" w-full px-6 py-4  bg-gradient-to-r from-indigo-100 to-indigo-200 rounded flex-grow-0">
            <h3>Total</h3>
            <div className="flex">
              <div className="mr-1 text-3xl">{total}</div>
              <div className=" mt-1 font-bold text-sm text-indigo-600 ">
                {currency}
              </div>
            </div>
          </div>
          <div className="mt-4 w-full px-6 py-4  bg-gradient-to-r from-indigo-100 to-indigo-200 rounded flex-grow-0">
            <h3>Living Costs</h3>
            <div className="flex">
              <div className="mr-1 text-3xl">
                {livingCosts}
              </div>
              <div className=" mt-1 font-bold text-sm text-indigo-600 ">
                {currency}
              </div>
            </div>
          </div>
          <div className="mt-4 w-full px-6 py-4  bg-gradient-to-r from-indigo-100 to-indigo-200 rounded flex-grow-0">
            <h3>Prognosed</h3>
            <div className="flex">
              <div className="mr-1 text-3xl">
                {dayjs().isAfter(endDate) ? total : prognosed}
              </div>
              <div className=" mt-1 font-bold text-sm text-indigo-600 ">
                {currency}
              </div>
            </div>
          </div>

        </div>

        <div className=" flex-1">
          <div className=" mt-2  bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-70 text-white font-bold uppercase py-2 px-4 text-sm  rounded mb-7">
            Entries
          </div>
          {categories?.map((category) => (
            <div
              className=" bg-gradient-to-r from-indigo-50 to-indigo-100 rounded mb-4 flex justify-between "
              key={category.key}
            >
              <div className=" px-6 py-4  basis-44  font-bold flex flex-col">
                <div className="flex justify-center">
                  <div className="mr-1 text-3xl">
                    {category.value.toFixed(0)}
                  </div>
                  <div className=" mt-1 font-thin text-sm text-gray-400 ">
                    {currency}
                  </div>
                </div>
                <UiBadge
                  className={` ${
                    category?.key === "Food" ? "bg-green-400" : "bg-indigo-400"
                  } mt-1 ${
                    !category?.key ? "bg-gray-300 text-black" : "text-white"
                  } `}
                  text={category?.key || "No category"}
                />
              </div>
              <div className=" px-6 py-4  basis-44  font-bold flex flex-col">
                <div className="flex justify-center">
                  <div className="mr-1 text-gray-600 text-2xl">
                    {(
                      (100 / Number(total)) *
                      Number(category.value.toFixed(0))
                    ).toFixed(1)}
                  </div>
                  <div className=" mt-1 font-thin text-sm text-gray-400 ">
                    %
                  </div>
                </div>
              </div>
              <div className="flex  flex-grow px-6 py-4 font-semibold text-indigo-500"></div>
            </div>
          ))}
        </div>
      </div>
    </Transition>
  );
};

export default ExpenseListingTable;
