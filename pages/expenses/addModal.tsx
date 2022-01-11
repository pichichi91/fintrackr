import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, useEffect, useState } from "react";
import { addExpense } from "../../api/expenses/add-expense";
import { getExpenses } from "../../api/expenses/get-expenses";
import Modal from "react-modal";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AllExpenseCategoriesProps } from "../../api/expense-categories/get-categories";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/New_York");

type ExpenseProps = {
  date?: Dayjs;
  amount: number;
  currency: string;
  days: number;
  category: number ;
  notes: string;
};

type AddExpenseModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  reload: () => void;
  categories: AllExpenseCategoriesProps[];
};

const currencies = ["MXN", "CHF", "USD", "EUR"];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  setOpen,
  categories,
  reload,
}) => {
  const [newData, setNewData] = useState<ExpenseProps>({
    date: dayjs().utc(),
    amount: 100,
    currency: "MXN",
    days: 1,
    category: 0,
    notes: '',
  });

  const changeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value);
    setNewData({ ...newData, amount: newAmount });
  };

  const changeDays = (e: ChangeEvent<HTMLInputElement>) => {
    setNewData({ ...newData, days: Number(e.target.value) });
  };

  const changeCurrency = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setNewData({ ...newData, currency: newCurrency });
  };

  const changeDate = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = dayjs(e.target.valueAsDate);
    setNewData({ ...newData, date: newDate.utc()! });
  };

  const changeNotes = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const notes = e.target.value;
    setNewData({ ...newData, notes });
  }

  const handleSubmit = async () => {
    const { date, amount, currency, days, category, notes } = newData;

    const splittedAmount = amount / days;

    const startDate = date;


    const parsedCategory = category === 0 ? null : category

    const expenses = Array.from(Array(days).keys())?.map((day) => ({
      date: startDate?.add(day, "days")?.toDate()!,
      amount: splittedAmount,
      currency,
     category: parsedCategory, notes
    }));

    const { error } =  await addExpense(expenses);

    if(!error) setOpen(false)
    reload();
  };

  const queryExpenses = async () => {
    const { data, error } = await getExpenses({});

    if (!error) {
      console.log({ data });

      setOpen(false);
    }
  };

  const changeCategory = (e: ChangeEvent<HTMLSelectElement>) => {

    const category = Number(e.target.value);

    if(category > 0){
      setNewData({...newData, category})
    }

  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  return (
    <>
      <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            
            <div className="flex mx-2 items-start justify-between pl-2 p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-2xl font-semibold">Add new expense</h3>

            </div>
            <div className="relative p-6 flex-auto flex ">
              <div className="mx-2  w grid grid-cols-1 gap-6">
                <label className="flex flex-col">
                  <span>Date</span>
                  <input
                    onChange={changeDate}
                    value={newData?.date?.format("YYYY-MM-DD")}
                    type="date"
                    className="styled-input"
                  />
                </label>

                <label className="flex flex-col">
                  <span>Currency</span>
                  <select
                    onChange={changeCurrency}
                    value={newData?.currency}
                    className="styled-input"
                  >
                    {currencies?.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col">
                  <span>Total</span>
                  <input
                    onChange={changeAmount}
                    value={newData?.amount}
                    type="number"
                    className="styled-input"
                  />
                </label>
                <label className="flex flex-col">
                  <span>Category</span>
                  <select
                    onChange={changeCategory}
                    value={newData?.category}
                    className=" styled-input"
                  >
                    <option value={0}>Select a category</option>

                    {categories?.map((category) => (
                      <option className="capitalize " key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col">
                  <span>Split to X days</span>
                  <input
                    onChange={changeDays}
                    value={newData?.days}
                    type="number"
                    className="styled-input"
                  />
                  <div className="flex mt-1  text-gray-500 text-xs">
                    <p className="mr-2  font-bold">Amount per day:</p>
                    <p>
                      {(newData.amount / newData.days).toFixed(2)}{" "}
                      {newData.currency}
                    </p>
                  </div>
                </label>
              </div>
              <div className="ml-8">
              <label className="flex flex-col">
              <span>Notes</span>

                <textarea value={newData.notes}  onChange={changeNotes} rows={12} cols={25}  className=" h-20 styled-input flex-1 " />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className=" danger"
                type="button"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              <button className="primary" type="button" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
export default AddExpenseModal;
