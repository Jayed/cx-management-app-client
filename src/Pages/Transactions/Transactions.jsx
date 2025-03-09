import React from "react";
import useTransactions from "../../Hooks/useTransactions";


const Transactions = () => {
  const { transactions, refetch, isPending, isError, error } = useTransactions();
  console.log(transactions);

  if (isPending) {
    return <p className="text-center text-blue-500">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transactions List</h2>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-600">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Details</th>
                <th className="border border-gray-300 px-4 py-2">Customer</th>
                <th className="border border-gray-300 px-4 py-2">Debit ($)</th>
                <th className="border border-gray-300 px-4 py-2">Credit ($)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{transaction.transactionID}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{transaction.details}</td>
                  <td className="border border-gray-300 px-4 py-2">{transaction.customer}</td>
                  <td className="border border-gray-300 px-4 py-2 text-red-500">{transaction.debit}</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-500">{transaction.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
