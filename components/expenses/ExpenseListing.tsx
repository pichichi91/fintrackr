import dayjs from "dayjs";
import { AllExpensesProps } from "../../api/expenses/get-expenses";
import UiBadge from "../ui-badge/ui-badge";
import { ImCross } from "react-icons/im";
import { IoIosAdd } from "react-icons/io";

type ExpenseListingProps = {
  expenses: AllExpensesProps[];
  deleteAction?: (id: string) => void;
  currencyFactors: any;
  currency: string;
  type?: "DEFAULT" | "DAY" | 'CATEGORY';
  addAction?: () => void;
  dailyAverage?: number; 
  prognosedTotal?: number;
};
const ExpenseListingTable: React.FC<ExpenseListingProps> = ({
  expenses,
  deleteAction,
  currency,
  currencyFactors,
  type = "DEFAULT",
  addAction,
  dailyAverage = 0,
  prognosedTotal = 0,
}) => {

  const total = Number(expenses
  .reduce((i, c) => i + c.amount * (currencyFactors ?  currencyFactors[c.currency] : 1), 0)
  .toFixed(2));

  const dailyDifference = Number((total - dailyAverage).toFixed(0))
  
  
  return (

  <div className="flex flex-col mt-4 md:mt-0 md:flex-row">
    {type === "DAY" && (
      <div className="md:mr-6 mb-4  font-bold flex flex-col items-start  ">
        <button
          className=" w-full  mb-4  shadow-lg primary"
          onClick={addAction}
        >
          <div className="flex">
            <IoIosAdd size={40} />{" "}
            <div className="ml-2 flex items-center">Add Entry</div>
          </div>
        </button>

        <div className=" w-full px-6 py-4  bg-gradient-to-r from-indigo-100 to-indigo-200 rounded flex-grow-0">
          <h3>Total</h3>
          <div className="flex">
            <div className="mr-1 text-3xl">
              {total}
            </div>
            <div className=" mt-1 font-bold text-sm text-indigo-600 ">
              {currency}
            </div>
          </div>
          <div className={`flex ${dailyDifference > 0 ?   'text-red-400' : 'text-green-600'} `}> {dailyDifference > 0 && '+'} {dailyDifference} <div className=" text-gray-500 text-xs ml-1 mt-1">vs average</div> </div>
        </div>
        <div className="mt-4 w-full px-6 py-4  bg-gradient-to-r from-indigo-100 to-indigo-200 rounded flex-grow-0">
          <h3>Monthly projection</h3>
          <div className="flex">
            <div className="mr-1 text-3xl">
              {prognosedTotal}
            </div>
            <div className=" mt-1 font-bold text-sm text-indigo-600 ">
              {currency}
            </div>
          </div>
        </div>
      </div>
    )}
    <div className=" flex-1">
      <div className=" mt-2  bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-70 text-white font-bold uppercase py-2 px-4 text-sm  rounded mb-7">
        Entries
      </div>
      {expenses?.map((expense) => (
        <div
          className=" bg-gradient-to-r from-indigo-50 to-indigo-100 rounded mb-4 flex justify-between "
          key={Math.random()}
        >
          {type === "DEFAULT" && (
            <div className="px-6 py-3 flex flex-col">
              <div className=" font-extrabold  text-center text-4xl whitespace-nowrap ">
                {dayjs(expense.date).format("DD")}
              </div>
              <UiBadge
                className="mt-1 text-indigo-600 bg-indigo-100 "
                text={dayjs(expense.date).format("MMMM")}
              />
            </div>
          )}

          <div className=" px-6 py-4  basis-44  font-bold flex flex-col">
            <div className="flex justify-center">
              <div className="mr-1 text-3xl">
                {(
                  expense.amount *
                  (currencyFactors ? currencyFactors[expense.currency] : 1)
                ).toFixed(0)}
              </div>
              <div className=" mt-1 font-thin text-sm text-gray-400 ">
                {currency}
              </div>
            </div>
            <UiBadge
              className={` ${
                expense.category?.name === "Food"
                  ? "bg-green-400"
                  : "bg-indigo-400"
              } mt-1 ${!expense.category?.name ? 'bg-gray-300 text-black' : 'text-white'} `}
              text={expense.category?.name || 'No category'}
            />
          </div>
          <div className="md:flex hidden flex-grow px-6 py-4 font-semibold text-indigo-500">
            <div className="text-gray-600 text-base  mt-1">
              {" "}
              {expense.notes}
            </div>
          </div>

          <div className="pl-0 md:pl-4 flex items-center">
            {" "}
            {deleteAction && (
              <button
                onClick={
                  deleteAction ? () => deleteAction(expense.id) : undefined
                }
                className="text-red-700 hover:text-red-500"
              >
                <ImCross size={20} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)
    }

export default ExpenseListingTable;
