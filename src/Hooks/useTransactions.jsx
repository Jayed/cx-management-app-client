import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useTransactions = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: fetchTransactions = [], // Rename `data` to `fetchTransactions`
    refetch,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await axiosPublic.get("/transactions"); // No need for full URL
      return response.data.data;
    },
  });

  return [fetchTransactions, refetch, isPending, isError, error];
};

export default useTransactions;