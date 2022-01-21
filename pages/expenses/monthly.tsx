import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { AllExpensesProps, getExpenses } from "../../api/expenses/get-expenses";
import ExpensesArea from "../../components/graphs/ExpensesArea";
import AddExpenseModal from "../../components/expenses/addModal";
import { Converter } from "easy-currencies";

import { deleteExpense } from "../../api/expenses/delete-expense";
import { getExpenseCategories } from "../../api/expense-categories/get-categories";

import { months, currencies } from "../../utils";
import { useUser } from "@clerk/nextjs";
import UiLoading from "../../components/ui-loading/UiLoading";
import ExpenseListing from "../../components/expenses/ExpenseListing";
import { ExpensesProps, ParsedExpensesProps } from "../../components/types";
import CategoryListing from "../../components/expenses/CategoryListing";
import ExpensesNavigation from "./components/ExpensesNavigation";
import _ from "lodash";

const groupByCategory = (expenses: AllExpensesProps[], factorObject: any) => {
  const groupBy = expenses.reduce(
    (result: any, currentItem: AllExpensesProps) => {
      (result[currentItem.category?.name] =
        result[currentItem.category?.name] || []).push(currentItem);
      return result;
    },
    {}
  );


  type Category = {
    value: number;
    key: string
  }

  return Object.entries(groupBy).map(([key, items]) => {
    const expenseItems: any = items;
    const value = expenseItems.reduce(
      (s: number, v: AllExpensesProps) =>
        s + v.amount * factorObject[v.currency],
      0
    );

    return { key: key === "undefined" ? "" : key, value };
  }).sort(( a: Category, b: Category ) => b.value - a.value);

};

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
  const [years, setYears] = useState<string[]>([dayjs().format('YYYY')])
  const [months, setMonths] = useState<{id: string, name: string}[]>([{id: dayjs().format('M'), name:dayjs().format('MM')}])

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

    const expenseYears = new Set(expenses.map(expense => dayjs(expense.date).format('YYYY')));

    const expenseMonths : {id: string, name: string}[] = []
    expenses.map(expense => {
      
      const date = dayjs(expense.date)

      const found = months.find(month => month.name === date.format('MMMM'))
      console.log({found })
      if (!expenseMonths.find(month => month.name === date.format('MMMM'))) {
        expenseMonths.push({ id: date.format('M'), name: date.format('MMMM')}) 
      }
    
    
    })

    setMonths(Array.from(expenseMonths));
    setYears(Array.from(expenseYears));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, selectedCurrency]);

  console.log({ expenses });


  return isLoading ? (
    <UiLoading />
  ) : (
    <>
<ExpensesNavigation activeItem="monthly" />

      <div className="flex flex-col md:flex-row mt-4 justify-between">
        <h2 className="flex-1 font-bold text-2xl ">Monthly</h2>

        <div className="flex flex-row md:justify-start justify-center sm:justify-between">
          <div className="flex mt-2 md:mt-0 ">
            <label className="flex flex-col ">
              <div className="flex flex-row items-center ">
                <span className=" hidden sm:inline mr-8 sm:mr-1 text-sm  text-gray-400 ">
                  Year
                </span>
              </div>
              <select
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                value={selectedMonth}
                className="styled-input mr-1"
                disabled={years.length === 1}
              >
                {years.length !== 1 &&
                <option value={0}>Select a year</option>
              }
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex mt-2 md:mt-0 ">
            <label className="flex flex-col ">
              <div className="flex flex-row items-center ">
                <span className=" hidden sm:inline mr-8 sm:mr-1 text-sm  text-gray-400 ">
                  Month
                </span>
              </div>
              <select
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                value={selectedMonth}
                className="styled-input mr-1"
                disabled={months.length === 1}
              >
                {months.length !== 1 &&
                <option value={0}>Select a month</option>
              }
                {months.map((month) => (
                  <option key={month.id} value={month.id}>
                    {month.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex mt-2 md:mt-0 ml-0 ">
            <label className="flex flex-col ">
              <div className="flex flex-row items-center ">
                <span className=" hidden sm:inline mr-3 sm:mr-2 text-sm text-gray-400 ">
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

      <div className="my-4 mt-4 ">
        <CategoryListing
          currency={selectedCurrency} prognosed={stats.prognosedTotal}
          categories={groupByCategory(expenses, currencyFactors)}
        />
      </div>

      {stats.prognosedTotal / stats.dailyAverage > 1 && (
        <div className="flex rounded justify-center mt-8 mb-8">
          <ExpensesArea
            currencyLabel={
              currencies.find((currency) => currency.value === selectedCurrency)
                ?.label || ""
            }
            parsedExpenses={parsedExpenses}
            width={1000}
            height={400}
          />
        </div>
      )}



      <div className="my-4 mt-12 ">
        <h2 className="font-bold text-2xl mb-8">This month expenses</h2>
        <ExpenseListing
          currency={selectedCurrency}
          currencyFactors={currencyFactors}
          expenses={expenses}
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
