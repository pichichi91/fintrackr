import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, useState } from "react";
import { addExpense } from "../../api/expenses/add-expense";
import { getExpenses } from "../../api/expenses/get-expenses";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AllExpenseCategoriesProps } from "../../api/expense-categories/get-categories";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/New_York");

import currencies from "./../../utils/currencies";
import UiLoading from "../ui-loading/UiLoading";
import { Dialog } from "@headlessui/react";
type ExpenseProps = {
  date?: Dayjs;
  amount: number;
  currency: string;
  days: number;
  category: number;
  notes: string;
  splitBy: "days" | "months";
};

type AddExpenseModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  reload: () => void;
  categories: AllExpenseCategoriesProps[];

  user: string;
};

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  setOpen,
  categories,
  reload,
  user,
  isOpen,
}) => {
  const [newData, setNewData] = useState<ExpenseProps>({
    date: dayjs().utc(),
    amount: 100,
    currency: currencies[0].value,
    days: 1,
    category: 0,
    notes: "",
    splitBy: "days",
  });


  const changeSplit = (e: ChangeEvent<HTMLSelectElement>) => {
    const splitBy = e.target.value as "days" | "months";
    setNewData({ ...newData, splitBy });
  };

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
  };

  const handleSubmit = async () => {
    const { date, amount, currency, days, category, notes } = newData;

    const splittedAmount = amount / days;

    const startDate = date;

    const parsedCategory = category === 0 ? null : category;

    const expenses = Array.from(Array(days).keys())?.map((day) => ({
      date: startDate?.add(day, newData.splitBy)?.toDate()!,
      amount: splittedAmount,
      currency,
      category: parsedCategory,
      notes,
      user_id: user,
    }));

    const { error } = await addExpense(expenses);

    if (!error) setOpen(false);
    reload();
  };

  const changeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    const category = Number(e.target.value);

    if (category > 0) {
      setNewData({ ...newData, category });
    }
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  return (
    <Dialog
      className="hidden fixed z-10 inset-0 overflow-y-auto"
      open={isOpen}
      onClose={() => setOpen(false)}
    >
      <Dialog.Overlay className="fixed inset-0 -z-10 bg-black opacity-20" />

      <div className="bg-white m-4 md:m-16 p-4  md:p-8 rounded-xl">
        <Dialog.Title className="text-2xl font-semibold">
          Add a new expense
        </Dialog.Title>
        <Dialog.Description className="mb-4">
          <div className="relative  py-6 flex-auto flex flex-col md:flex-row ">
            <div className=" md:basis-1/2 grid grid-cols-1 gap-6">
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
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
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
                    <option
                      className="capitalize "
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col">
                <span>Split By</span>
                <select
                  onChange={changeSplit}
                  value={newData?.splitBy}
                  className="styled-input capitalize"
                >
                  {["days", "months"].map((item) => (
                    <option className="capitalize " key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col">
                <span>Split to X {newData.splitBy}</span>
                <input
                  onChange={changeDays}
                  value={newData?.days}
                  type="number"
                  className="styled-input"
                />
              </label>
            </div>
            <div className="flex flex-col mt-4  md:mt-0 md:ml-8">
              <div className="">
                <label className="flex flex-col">
                  <span>Notes</span>

                  <textarea
                    value={newData.notes}
                    onChange={changeNotes}
                    rows={5}
                    cols={25}
                    className=" h-20 styled-input flex-1 "
                  />
                </label>
              </div>
              <div className="mt-4">
                <h4 className=" font-bold text-lg">Summary</h4>
                <div>
                  {Array.from(Array(newData.days).keys())?.map((day) => {
                    const date = newData.date
                      ?.add(day, newData.splitBy)
                      .format("DD MMM YYYY");
                    return (
                      <div key={date} className="flex  text-gray-500 text-xs">
                        <p className="mr-2 w-20 font-bold">{date}</p>

                        <p className="text-gray-400">
                          {(newData.amount / newData.days).toFixed(2)}{" "}
                          {
                            currencies.find(
                              (currency) => currency.value === newData.currency
                            )?.label
                          }
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Description>


<div className="flex  justify-end">
        <button
                className=" danger"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="primary" onClick={handleSubmit}>
                Save Changes
              </button>
      </div>
      </div>
    </Dialog>
  );
};
export default AddExpenseModal;
