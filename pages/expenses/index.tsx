import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { AllExpensesProps, getExpenses } from "../../api/expenses/get-expenses";
import AddExpenseModal from "../../components/expenses/addModal";
import { Converter } from "easy-currencies";

import { deleteExpense } from "../../api/expenses/delete-expense";
import { getExpenseCategories } from "../../api/expense-categories/get-categories";

import { months, currencies } from "./../../utils";
import { useUser } from "@clerk/nextjs";
import UiLoading from "../../components/ui-loading/UiLoading";
import ExpenseListing from "../../components/expenses/ExpenseListing";
import { ExpensesProps, ParsedExpensesProps } from "../../components/types";
import SummaryBox from "./components/SummaryBox";
import ExpensesNavigation from "./components/ExpensesNavigation";

const parseExpenses = (expenses: AllExpensesProps[], factorObject: any) => {
  const groupByDate = expenses.reduce(
    (result: any, currentItem: AllExpensesProps) => {
      (result[currentItem.date] = result[currentItem.date] || []).push(
        currentItem
      );
      return result;
    },
    {}
  );

  const dailyExpenses = Object.entries(groupByDate).map((entry: any) => {
    const [date, expenseValues] = entry;

    const unified = expenseValues.map((value: AllExpensesProps) => ({
      ...value,
      amount:
        factorObject && Object.keys(factorObject).includes(value.currency)
          ? value.amount * factorObject[value.currency]
          : value.amount,
    }));
    const total = unified.reduce(
      (s: number, v: AllExpensesProps) => s + v.amount,
      0
    );

    return { date: date + "T00:00:00.000Z", total };
  });

  const summedUpExpenses = dailyExpenses.map((day, index) => ({
    ...day,
    totalSum: dailyExpenses
      .slice(0, index + 1)
      .reduce((a, b) => a + b.total, 0),
  }));

  return { dailyExpenses, summedUpExpenses };
};

const Expenses: React.FC<ExpensesProps> = ({ queriedCategories }) => {
  const user = useUser();
  const queriedExpenses: AllExpensesProps[] = [];
  const [modalIsOpen, setIsOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState("MXN");
  const [currencyFactors, setCurrencyFactors] = useState();

  const [expenses, setExpenses] = useState(queriedExpenses);
  const [parsedExpenses, setParsedExpenses] = useState<ParsedExpensesProps>({
    dailyExpenses: [],
    summedUpExpenses: [],
  });

  const [isLoading, setIsLoading] = useState(false);

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
    setParsedExpenses(parseExpenses(queriedExpenses!, currencyFactors));
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

      const { dailyExpenses, summedUpExpenses } = parseExpenses(
        expenses || [],
        factorObject
      );
      setParsedExpenses({ dailyExpenses, summedUpExpenses });

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

  return isLoading ? (
    <UiLoading />
  ) : (
    <>
      <ExpensesNavigation activeItem="daily" />

      <div className="flex flex-col md:flex-row mt-0 justify-between">
        <div className="flex items-center justify-center md:justify-start"></div>
        <div className="flex flex-row md:justify-start justify-center sm:justify-between">
          <div className="flex mt-2 md:mt-0 ">
            <label className="flex flex-col ">
              <div className="flex flex-row items-center ">
                <span className=" hidden sm:inline mr-4 sm:mr-1 text-sm  text-gray-400 ">
                  Month
                </span>
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
          <div className="flex mt-2 md:mt-0 ml-0 md:ml-1">
            <label className="flex flex-col ">
              <div className="flex flex-row items-center ">
                <span className="hidden sm:inline mr-3 sm:mr-2 text-sm text-gray-400 ">
                  Currency
                </span>
              </div>
              <select
                onChange={(e) => setSelectedCurrency(e.target.value)}
                value={selectedCurrency}
                className="styled-input mr-1"
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
      </div>
      <div className="flex mt-4 sm:mt-8 md:mt-12 flex-wrap md:flex-nowrap">
        <SummaryBox
          title="Monthly total"
          stat={stats.monthlyTotal}
          currency={selectedCurrency}
        />
        <SummaryBox
          title="Daily average"
          stat={stats.dailyAverage}
          currency={selectedCurrency}
        />
        <SummaryBox
          last={true}
          title="Prognosed total"
          stat={stats.prognosedTotal}
          currency={selectedCurrency}
        />
      </div>

      <div className="my-8 ">
        <h2 className="font-bold text-2xl mb-8">Expenses Today</h2>
        <ExpenseListing
          currency={selectedCurrency}
          currencyFactors={currencyFactors}
          expenses={expenses?.filter((expense) =>
            dayjs(expense.date).startOf("day").isSame(dayjs().startOf("day"))
          )}
          type="DAY"
          addAction={() => setIsOpen(true)}
          deleteAction={deleteExpenseAndReload}
        />
      </div>

      {modalIsOpen && (
        <AddExpenseModal
          categories={queriedCategories}
          reload={reloadExpenses}
          isOpen={modalIsOpen}
          setOpen={setIsOpen}
          user={user.id}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: queriedCategories } = await getExpenseCategories();

  return {
    props: { queriedCategories }, // will be passed to the page component as props
  };
};
export default Expenses;
