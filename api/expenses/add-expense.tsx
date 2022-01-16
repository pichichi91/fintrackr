
export type ExpenseParams = {

  date: Date;
  amount: number;
  currency: string;

}

import supabaseClient from "../supabase-client";

const addExpense = async (values: ExpenseParams[]) => {

    const { data, error } = await supabaseClient
    .from('trackr_expenses')
    .insert(
      values,
      
    );

    return {data, error}

}

export { addExpense};
