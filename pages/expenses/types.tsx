import { AllExpenseCategoriesProps } from "../../api/expense-categories/get-categories";

export type ExpensesProps = {
  queriedCategories: AllExpenseCategoriesProps[];
};

export type DailyExpenseProps = {
  date: string;
  total: number;
};

export type SummedExpensesProps = DailyExpenseProps & { totalSum: number };

export type ParsedExpensesProps = {
  dailyExpenses: DailyExpenseProps[];
  summedUpExpenses: SummedExpensesProps[];
};
