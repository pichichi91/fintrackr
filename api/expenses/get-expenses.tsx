import dayjs from "dayjs";
import supabaseClient from "../supabase-client";

export type AllExpensesProps = {
  amount: number;
  date: string;
  currency: string;
  category: { name: string };
  id: string;
  notes: string;
};

type AllExpensesParams = {
  startDate?: string;
  endDate?: string;
  userId: string;

};

const getExpenses = async (filters: AllExpensesParams) => {

  const startDate = filters.startDate || dayjs().add(-10, 'years')
  const endDate = filters.endDate || dayjs().add(10, 'years')

  const { data, error } = await supabaseClient
    .from("trackr_expenses")
    .select("id, amount, currency, category(name), date, notes")
    .order("date")
    .gte('date', startDate)
    .lte('date', endDate)
    .eq('user_id', filters.userId
    )
  return { data, error };
};

const getAllExpenses = async (filters: AllExpensesParams) => {

  
  const { data, error } = await supabaseClient
    .from("trackr_expenses")
    .select("id, amount, currency, category(name), date, notes")
    .order("date")
    .eq('user_id', filters.userId)
  return { data, error };
};

export { getExpenses, getAllExpenses };
