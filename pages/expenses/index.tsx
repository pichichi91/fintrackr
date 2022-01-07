import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { AllExpensesProps, getExpenses } from "../../api/expenses/get-expenses";
import ExpensesArea from "../components/graphs/ExpensesArea";
import { UiBadge } from "../components/ui-badge/ui-badge";
import AddExpenseModal from "./addModal";
import { Converter } from "easy-currencies";

import { deleteExpense } from "../../api/expenses/delete-expense";
import {
  AllExpenseCategoriesProps,
  getExpenseCategories,
} from "../../api/expense-categories/get-categories";

const currencies = ["MXN", "CHF", "USD", "EUR"];

const months = [
  {
    id: 1,
    name: "January",
  },
  {
    id: 2,
    name: "February",
  },
  {
    id: 3,
    name: "March",
  },
  {
    id: 4,
    name: "April",
  },
  {
    id: 5,
    name: "May",
  },
  {
    id: 6,
    name: "June",
  },
  {
    id: 7,
    name: "July",
  },
  {
    id: 8,
    name: "August",
  },
  {
    id: 9,
    name: "September",
  },
  {
    id: 10,
    name: "October",
  },
  {
    id: 11,
    name: "November",
  },
  {
    id: 12,
    name: "December",
  },
];

type DaysType = Record<string, number>;

type ExpensesProps = {
  queriedExpenses: AllExpensesProps[];
  queriedCategories: AllExpenseCategoriesProps[];
};
const Expenses: React.FC<ExpensesProps> = ({
  queriedExpenses,
  queriedCategories,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState("MXN");
  const [currencyFactors, setCurrencyFactors] = useState();

  const [expenses, setExpenses] = useState(queriedExpenses);
  const [stats, setStats] = useState({
    monthlyTotal: 0,
    dailyAverage: 0,
    prognosedTotal: 0,
  });

  const reloadExpenses = async () => {
    const startDate = dayjs()
      .add(selectedMonth - 1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = dayjs()
      .add(selectedMonth - 1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    const filters = { startDate, endDate };

    const { data: queriedExpenses } = await getExpenses(filters);

    setExpenses(queriedExpenses!);
  };

  const deleteExpenseAndReload = (id: string) => {
    deleteExpense(id);
    reloadExpenses();
  };

  useEffect(() => {
    reloadExpenses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const getCurrencyFactors = async () => {
    const converter = new Converter();

    return await Promise.all(
      currencies.map(async (currency) => ({
        source: currency,
        destination: selectedCurrency,
        factor: await converter.convert(1, currency, selectedCurrency),
      }))
    ).then((data) => data);
  };

  useEffect(() => {
    getCurrencyFactors().then((factors) => {
      const factorObject: any = {};

      factors.map(({ source, factor }) => {
        factorObject[source] = factor;
      });

      setCurrencyFactors(factorObject);

      const monthlyTotal = Number(
        expenses
          .reduce((s, v) => s + v.amount * factorObject[v.currency], 0)
          .toFixed(0)
      );

      if (monthlyTotal == 0) {
        setStats({ monthlyTotal, dailyAverage: 0, prognosedTotal: 0 });
        return;
      }

      const expensesUntilToday = expenses.filter((expense) => {
        const expenseDate = dayjs(expense.date)
          .startOf("day")
          .isBefore(dayjs().add(1, "day").startOf("day"));

        if (expenseDate) return expense;
      });

      if (expensesUntilToday.length === 0){
        setStats({ monthlyTotal, dailyAverage: 0, prognosedTotal: 0 });
        return;
      }

      const days =  expensesUntilToday.reduce((acc: DaysType, { date }) => {
        acc[date] = acc[date] === undefined ? 1 : (acc[date] += 1);
        return acc;
      }, {});
      const dailyAverage = Number(
        (
          expensesUntilToday.reduce(
            (s, v) => s + v.amount * factorObject[v.currency],
            0
          ) / Object.keys(days).length
        ).toFixed(0)
      );

      setStats({
        monthlyTotal,
        dailyAverage,
        prognosedTotal: 30 * dailyAverage,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, selectedCurrency]);

  return (
    <>
      <div className="flex flex-col md:flex-row mt-4 justify-between">
        <div className="flex items-center">
          <h1 className="font-bold text-2xl">Expenses 2022</h1>
        </div>
        <div className="flex flex-row">
          <div className="flex mt-4 md:mt-0 ">
            <label className="flex flex-row ">
              <div className="flex flex-row items-center ">
                <span className="mr-1 text-md  text-gray-400 ">Month</span>
              </div>
              <select
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                value={selectedMonth}
                className="styled-input mr-1"
              >
                <option value={0}>Select a month</option>
                {months.map((month) => (
                  <option key={month.id} value={month.id}>
                    {month.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex mt-2 md:mt-0 ml-3 md:ml-4">
            <label className="flex flex-row ">
              <div className="flex flex-row items-center ">
                <span className="mr-2 text-md text-gray-400 ">Currency</span>
              </div>
              <select
                onChange={(e) => setSelectedCurrency(e.target.value)}
                value={selectedCurrency}
                className="styled-input mr-1"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="flex mt-8 md:mt-12 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/3 mb-6 md:mr-4 flex flex-col justify-center rounded-lg px-8 py-8 bg-indigo-50">
          <p className="text-xl font-bold">Monthly total</p>
          <div className="flex">
            <p className="flex text-left text-4xl font-bold text-indigo-800">
              {stats.monthlyTotal}
            </p>
            <p className="mt-1 ml-1 text-indigo-500 font-thin">
              {selectedCurrency}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/3 mb-6 md:mr-4 flex flex-col justify-center rounded-lg px-8 py-4 bg-indigo-50">
          <p className="text-xl font-bold">Daily average</p>
          <div className="flex">
            <p className="flex text-left text-4xl font-bold text-indigo-800">
              {stats.dailyAverage}
            </p>
            <p className="mt-1 ml-1 text-indigo-500 font-thin">
              {selectedCurrency}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/3 mb-6 flex flex-col justify-center rounded-lg px-8 py-4 bg-indigo-50">
          <p className="text-xl font-bold">Prognosed total</p>
          <div className="flex">
            <p className="flex text-left text-4xl font-bold text-indigo-800">
              {stats.prognosedTotal}
            </p>
            <p className="mt-1 ml-1 text-indigo-500 font-thin">
              {selectedCurrency}
            </p>
          </div>
        </div>
      </div>

      <div className="flex rounded justify-center mt-8 mb-8">
        <ExpensesArea width={1000} height={400} />
      </div>

      <div className="mt-8 mb-4 flex justify-end">
        <button className="primary" onClick={() => setIsOpen(true)}>
          Add Entry
        </button>
      </div>

      <table className="table-fixed w-full min-w-full ">
        <thead className="text-md text-left font-bold ">
          <tr>
            <td className="px-6 py-1 text-sm sm:text-base  tracking-wider">Date</td>
            <td className="px-6 py-3 text-sm sm:text-base tracking-wider ">Amount</td>
            <td className="px-6 py-3 text-sm sm:text-base tracking-wider ">Category</td>
            <td className="px-6 py-3 text-sm sm:text-base tracking-wider ">Actions</td>
          </tr>
        </thead>
        <tbody className="text-sm sm:text-base">
          {expenses.map((expense) => (
            <tr key={Math.random()}>
              <td className="px-6 py-4 whitespace-nowrap ">
                {dayjs(expense.date).format("DD MMM")}
              </td>
              <td className="px-6 py-4  font-bold">
                <div className="flex">
                  <p className="mr-1">
                    {(
                      expense.amount *
                      (currencyFactors ? currencyFactors[expense.currency] : 1)
                    ).toFixed(0)}
                  </p>
                  <p className=" font-thin text-sm text-gray-400 ">
                    {selectedCurrency}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">

                             <UiBadge
                  className={`${expense.category?.name === 'Food' ? 'bg-green-400'
                   : 'bg-indigo-400'  }`} 
                  text={expense.category?.name}
                />
              </td>
              <td>
                {" "}
                <button
                  onClick={() => deleteExpenseAndReload(expense.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalIsOpen && (
        <AddExpenseModal
          categories={queriedCategories}
          reload={reloadExpenses}
          isOpen={modalIsOpen}
          setOpen={setIsOpen}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const endDate = dayjs().endOf("month").format("YYYY-MM-DD");
  const { data: queriedExpenses } = await getExpenses({ startDate, endDate });
  const { data: queriedCategories } = await getExpenseCategories();

  return {
    props: { queriedExpenses, queriedCategories }, // will be passed to the page component as props
  };
};
export default Expenses;
