import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { AllExpensesProps, getExpenses } from "../../api/expenses/get-expenses";
import AddExpenseModal from "../../components/expenses/addModal";
import { Converter } from "easy-currencies";

import { deleteExpense } from "../../api/expenses/delete-expense";
import { getExpenseCategories } from "../../api/expense-categories/get-categories";

import {  currencies } from "./../../utils";
import { useUser } from "@clerk/nextjs";
import ExpenseListing from "../../components/expenses/ExpenseListing";
import { ExpensesProps } from "../../components/types";
import ExpensesNavigation from "./components/ExpensesNavigation";
import { Transition } from "@headlessui/react";


const Expenses: React.FC<ExpensesProps> = ({ queriedCategories }) => {
  const user = useUser();
  const queriedExpenses: AllExpensesProps[] = [];
  const [modalIsOpen, setIsOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState("MXN");
  const [currencyFactors, setCurrencyFactors] = useState();

  const [expenses, setExpenses] = useState(queriedExpenses);


  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    monthlyTotal: 0,
    dailyAverage: 0,
    prognosedTotal: 0,
  });

  const reloadExpenses = async () => {
    setIsLoading(true);
    const startDate = dayjs()
      .add(selectedMonth - 1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = dayjs()
      .add(selectedMonth - 1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    const { id: userId } = user;

    const filters = { startDate, endDate, userId };

    const { data: queriedExpenses } = await getExpenses(filters);

    setExpenses(queriedExpenses || []);
    setIsLoading(false);
  };

  const deleteExpenseAndReload = (id: string) => {
    setIsLoading(true);
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
        factor: await converter.convert(1, currency.value, selectedCurrency),
      }))
    ).then((data) => data);
  };

  useEffect(() => {
    getCurrencyFactors().then((factors) => {
      const factorObject: any = {};

      factors.map(({ source, factor }) => {
        factorObject[source.value] = factor;
      });

      setCurrencyFactors(factorObject);



      const monthlyTotal = Number(
        expenses
          ?.reduce((s, v) => s + v.amount * factorObject[v.currency], 0)
          .toFixed(0)
      );

      if (monthlyTotal == 0) {
        setStats({ monthlyTotal, dailyAverage: 0, prognosedTotal: 0 });
        return;
      }

      const expensesUntilToday = expenses?.filter((expense) => {
        const expenseDate = dayjs(expense.date)
          .startOf("day")
          .isBefore(dayjs().add(1, "day").startOf("day"));

        if (expenseDate) return expense;
      });

      if (expensesUntilToday?.length === 0) {
        setStats({ monthlyTotal, dailyAverage: 0, prognosedTotal: 0 });
        return;
      }

      const totalUntilNow = expensesUntilToday?.reduce(
        (s, v) => s + v.amount * factorObject[v.currency],
        0
      );

      const dailyAverage = Number(
        (totalUntilNow / Number(dayjs().format("D"))).toFixed(0)
      );

      const daysOfMonth = Number(dayjs().endOf("month").format("D"));

      setStats({
        monthlyTotal,
        dailyAverage,
        prognosedTotal: daysOfMonth * dailyAverage,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, selectedCurrency]);

  return (
    <Transition
    show={!isLoading}
    enter="transition-opacity duration-400 ease-in"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition-opacity duration-400 ease-in"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div>
      <ExpensesNavigation activeItem="daily" />

      <div className="flex flex-row mt-0 justify-between">
        <h2 className="flex-1 font-bold text-2xl ">Today</h2>
          <div className="flex mt-2 md:mb-8 md:mt-0 ml-0 md:ml-1">
            <label className="flex flex-col ">
              <div className="flex flex-row items-center ">
                <span className="hidden sm:inline mr-3 sm:mr-2 text-sm text-gray-400 ">
                  Currency
                </span>
              </div>
              <select
                onChange={(e) => setSelectedCurrency(e.target.value)}
                value={selectedCurrency}
                className="styled-input"
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
      </div>


      <div className=" animate ">
        <ExpenseListing
          currency={selectedCurrency}
          currencyFactors={currencyFactors}
          expenses={expenses?.filter((expense) =>
            dayjs(expense.date).startOf("day").isSame(dayjs().startOf("day"))
          )}
          type="DAY"
          addAction={() => setIsOpen(true)}
          deleteAction={deleteExpenseAndReload}
          dailyAverage={stats.dailyAverage}
          prognosedTotal={stats.prognosedTotal}
        />
      </div>


        <AddExpenseModal
          categories={queriedCategories}
          reload={reloadExpenses}
          isOpen={modalIsOpen}
          setOpen={setIsOpen}
          user={user.id}
        />
      
    </div>
    </Transition>

  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: queriedCategories } = await getExpenseCategories();

  return {
    props: { queriedCategories }, // will be passed to the page component as props
  };
};
export default Expenses;
