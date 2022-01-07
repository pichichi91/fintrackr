import supabaseClient from "../supabase-client";

export type AllExpenseCategoriesProps = {
  name: string;
  id: string;
};

const getExpenseCategories = async () => {
  return await supabaseClient
    .from("reporti_categories")
    .select("id, name")
    .order("id");

};

export { getExpenseCategories };
