import dayjs from "dayjs";
import { AllExpensesProps } from "../../../api/expenses/get-expenses";
import UiBadge from "../../../components/ui-badge/ui-badge";
import {TiDelete} from "react-icons/ti"
type TableListingProps = {
  expenses: AllExpensesProps[];
  deleteAction?: (id: string) => void;
  currencyFactors: any;
  currency: string;
  type?: "DEFAULT" | "DAY";
};
const TableListing: React.FC<TableListingProps> = ({
  expenses,
  deleteAction,
  currency,
  currencyFactors,
  type = "DEFAULT",
}) => (
  <table className="table-fixed w-full min-w-full ">
    <thead className="text-md text-left font-bold ">
      <tr>
        {type === "DEFAULT" && (
          <td className="px-6 py-1 text-sm sm:text-base  tracking-wider">
            Date
          </td>
        )}
        <td className="px-6 py-3 text-sm sm:text-base tracking-wider ">
          Amount
        </td>
        <td className="px-6 py-3 text-sm sm:text-base tracking-wider ">
          Category
        </td>
        <td className="px-6 py-3 text-sm sm:text-base tracking-wider ">
          Actions
        </td>
      </tr>
    </thead>
    <tbody className="text-sm sm:text-base">
      {expenses?.map((expense) => (
        <tr key={Math.random()}>
          {type === "DEFAULT" && (
            <td className="px-6 py-4 whitespace-nowrap ">
              {dayjs(expense.date).format("DD MMM")}
            </td>
          )}

          <td className="px-6 py-4  font-bold">
            <div className="flex">
              <p className="mr-1">
                {(
                  expense.amount *
                  (currencyFactors ? currencyFactors[expense.currency] : 1)
                ).toFixed(0)}
              </p>
              <p className=" font-thin text-sm text-gray-400 ">{currency}</p>
            </div>
          </td>
          <td className="px-6 py-4">
            <UiBadge
              className={`${
                expense.category?.name === "Food"
                  ? "bg-green-400"
                  : "bg-indigo-400"
              }`}
              text={expense.category?.name}
            />
          </td>
          <td>
            {" "}
            {deleteAction && (
              <button
                onClick={
                  deleteAction ? () => deleteAction(expense.id) : undefined
                }
                className="text-red-500"
              >
                
                <TiDelete size={25} />
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TableListing;
