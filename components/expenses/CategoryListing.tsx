import UiBadge from "../ui-badge/ui-badge";
import { ImCross } from "react-icons/im";

type CategoryProps = {
  value: number;
  key: string;
};

type ExpenseListingProps = {
  categories: CategoryProps[];
  currency: string;
  addAction?: () => void;
};

const ExpenseListingTable: React.FC<ExpenseListingProps> = ({
  categories,
  currency,
}) => {
  const total = categories?.reduce((i, c) => i + c.value, 0).toFixed(2);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mr-6 mb-4  font-bold flex flex-col items-start  ">
        <div className=" basis-14 px-6 py-4  bg-gradient-to-r from-indigo-100 to-indigo-200 rounded flex-grow-0">
          <h3>Total</h3>
          <div className="flex">
            <div className="mr-1 text-3xl">{total}</div>
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
                <div className="mr-1 text-3xl">{category.value.toFixed(0)}</div>
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
                <div className="mr-1 text-gray-600 text-2xl">{(100 / Number(total) * Number(category.value.toFixed(0))).toFixed(1) }</div>
                <div className=" mt-1 font-thin text-sm text-gray-400 ">%</div>
              </div>
            </div>
            <div className="flex  flex-grow px-6 py-4 font-semibold text-indigo-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseListingTable;
