


import supabaseClient from "../supabase-client";

const deleteExpense = async (id: string) => {

    const { data, error } = await supabaseClient
    .from('trackr_expenses')
    .delete().match({id });
}

export { deleteExpense};
