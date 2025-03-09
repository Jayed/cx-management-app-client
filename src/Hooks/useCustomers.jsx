// using useQuery
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const useCustomers = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch customers using useQuery
  const {
    data: customers = [],
    refetch,
    isPending,
    error
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await axiosPublic.get("/customers/");
      return response.data.data;
    },
  });

  return [customers, refetch, isPending, error];
};

export default useCustomers;
