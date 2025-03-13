import React, { useEffect, useState } from "react";
import useCustomers from "../../Hooks/useCustomers";
import useTransactions from "../../Hooks/useTransactions";

const CxVsTxSummary = () => {
  const [customerSummary, setCustomerSummary] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const [customers] = useCustomers(); // Fetch customers
  const [transactions] = useTransactions(); // Fetch transactions

  useEffect(() => {
    if (customers.length > 0 && transactions.length > 0) {
      calculateCustomerSummary();
    }
  }, [customers, transactions]);

  const calculateCustomerSummary = () => {
    const summary = customers.map((customer) => {
      const customerTransactions = transactions.filter(
        (tx) => tx.customer?._id === customer._id
      );

      const totalExpense = customerTransactions
        .filter((tx) => tx.transactionType === "expense")
        .reduce((sum, tx) => sum + tx.expense, 0);

      const totalDeposit = customerTransactions
        .filter((tx) => tx.transactionType === "deposit")
        .reduce((sum, tx) => sum + tx.deposit, 0);

      return {
        id: customer._id,
        name: customer.name,
        totalTransactions: customerTransactions.length,
        totalExpense,
        totalDeposit,
        balance: totalDeposit - totalExpense,
      };
    });

    setCustomerSummary(summary);
  };

  // Function to open modal with selected customer's transactions
  const handleCustomerClick = (customerId, customerName) => {
    const filteredTransactions = transactions.filter(
      (tx) => tx.customer?._id === customerId
    );
    setSelectedCustomer({ id: customerId, name: customerName });
    setCustomerTransactions(filteredTransactions);
    setIsModalOpen(true); // Open modal
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="overflow-x-auto text-cyan-900 mx-2 md:mx-8">
      <h2 className="text-xl font-bold mb-4">
        Customer vs Transaction Summary
      </h2>
      <table className="table w-full border">
        <thead>
          <tr className="bg-blue-400">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2"># Trans</th>
            <th className="px-4 py-2">Total Expense (¥)</th>
            <th className="px-4 py-2">Total Deposit (¥)</th>
            <th className="px-4 py-2">Balance (¥)</th>
          </tr>
        </thead>
        <tbody>
          {customerSummary.map((data, index) => {
            const isNegative = data.balance < 0;
            return (
              <tr
                key={index}
                className={
                  isNegative
                    ? "bg-red-200"
                    : index % 2 === 0
                    ? "bg-white"
                    : "bg-gray-200"
                }
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleCustomerClick(data.id, data.name)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    {data.name}
                  </button>
                </td>
                <td className="px-4 py-2">{data.totalTransactions}</td>
                <td className="px-4 py-2">{data.totalExpense}</td>
                <td className="px-4 py-2">{data.totalDeposit}</td>
                <td className="px-4 py-2">{data.balance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Popup Modal */}
      {isModalOpen && selectedCustomer && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-2 sm:px-4"
          onClick={closeModal} // Close modal when clicking outside
        >
          <div
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-11/12 sm:w-3/4 max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl relative"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
              onClick={closeModal}
            >
              ✕
            </button>

            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
              Transactions of {selectedCustomer.name}
            </h3>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
              <table className="table w-full border">
                <thead>
                  <tr className="bg-blue-400 text-xs sm:text-sm">
                    <th className="px-2 sm:px-4 py-2">#</th>
                    <th className="px-2 sm:px-4 py-2">Tx-ID</th>
                    <th className="px-2 sm:px-4 py-2">Details</th>
                    <th className="px-2 sm:px-4 py-2">Date</th>
                    <th className="px-2 sm:px-4 py-2">Qty/Amt</th>
                    <th className="px-2 sm:px-4 py-2">unitP./rmbR.</th>
                    <th className="px-2 sm:px-4 py-2">Expense(¥)</th>
                    <th className="px-2 sm:px-4 py-2">Deposit(¥)</th>
                  </tr>
                </thead>
                <tbody>
                  {customerTransactions.map((tx, index) => (
                    <tr
                      key={tx._id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-200"
                      } text-xs sm:text-sm`}
                    >
                      <td className="px-2 sm:px-4 py-2">{index + 1}</td>
                      <td className="px-2 sm:px-4 py-2">{tx?.transactionID}</td>
                      <td className="px-2 sm:px-4 py-2">{tx?.details}</td>
                      <td className="px-2 sm:px-4 py-2">
                        {tx?.date
                          ? new Date(tx.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="px-2 sm:px-4 py-2">
                        {tx?.quantity_amount ?? "0"}
                      </td>
                      <td className="px-2 sm:px-4 py-2">
                        {tx?.unitPrice_rmbRate ?? "0"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 font-medium">
                        {tx?.expense
                          ? tx.expense.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 font-medium">
                        {tx?.deposit
                          ? tx.deposit.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CxVsTxSummary;
