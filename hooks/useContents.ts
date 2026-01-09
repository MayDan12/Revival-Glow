// Time to fetch the contents from the database that has name and images

import { supabase } from "@/utils/supabase/client";

export const useContents = () => {
  const fetchContents = async () => {
    const { data, error } = await supabase
      .from("contents")
      .select("id, name, value")
      .eq("name", "images");

    if (error) {
      console.error("Error fetching contents:", error);
      return [];
    }

    return data;
  };

  return { fetchContents };
};
