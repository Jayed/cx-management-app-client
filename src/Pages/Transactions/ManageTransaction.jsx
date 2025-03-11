import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useCustomers from "../../Hooks/useCustomers";
import Pagination from "../../Components/Pagination/Pagination";
import useTransactions from "../../Hooks/useTransactions";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ManageTransaction = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("expense");
  // const [amount, setAmount] = useState(0);
  // const [rate, setRate] = useState(0);
  // const [quantity, setQuantity] = useState(0);
  // const [unitPrice, setUnitPrice] = useState(0);
  const [quantity_amount, setQuantity_amount] = useState();
  const [unitPrice_rmbRate, setUnitPrice_rmbRate] = useState();
  const [expense, setExpense] = useState(0);
  const [deposit, setDeposit] = useState(0);

  const axiosPublic = useAxiosPublic();
  const [customers] = useCustomers();
  const [transactions, setTransactions] = useState([]);
  const [fetchedTransactions, refetch] = useTransactions();

  // Set transactions in state when fetchedTransactions changes
  useEffect(() => {
    if (fetchedTransactions) {
      const sortedTransactions = fetchedTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setTransactions(sortedTransactions);
    }
  }, [fetchedTransactions]);

  // State for pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  // Update pagination variables when transactions change
  useEffect(() => {
    if (transactions?.length > 0) {
      SetPaginationVariables();
    }
  }, [transactions, itemOffset]); // Trigger when `transactions` or `itemOffset` changes

  const SetPaginationVariables = () => {
    if (transactions?.length > 0) {
      const endOffset = itemOffset + itemsPerPage;
      setPageCount(Math.ceil(transactions.length / itemsPerPage));
      setCurrentItems(transactions.slice(itemOffset, endOffset));
    } else {
      setCurrentItems([]); // Set to empty array if no transactions
    }
  };

  // Handle pagination click
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % transactions.length;
    setItemOffset(newOffset);
  };

  console.log("current Items: ", currentItems);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTransactions([]);
      return;
    }

    const searchWords = searchTerm.toLowerCase().split(" ");
    const results = transactions.filter((tx) =>
      searchWords.every(
        (word) =>
          tx.details?.toLowerCase().includes(word) ||
          tx.customer?.name?.toLowerCase().includes(word)
      )
    );

    setFilteredTransactions(results);
  }, [searchTerm, transactions]);

  useEffect(() => {
    if (transactionType === "expense") {
      setExpense(quantity_amount * unitPrice_rmbRate);
    } else {
      setDeposit(quantity_amount / unitPrice_rmbRate);
    }
  }, [quantity_amount, unitPrice_rmbRate, transactionType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = {
      transactionID: transactions.length + 1,
      date,
      customer,
      details: description,
      quantity_amount: parseFloat(quantity_amount) || 0,
      unitPrice_rmbRate: parseFloat(unitPrice_rmbRate) || 0,
      expense: parseFloat(expense) || 0,
      deposit: parseFloat(deposit) || 0,
    };
    console.log(transactionData);
    Swal.fire({
      title: "Confirm Transaction",
      text: "Do you want to save this transaction?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (editingTransaction) {
            await axiosPublic.put(
              `/transactions/${editingTransaction._id}`,
              transactionData
            );
            Swal.fire("Updated!", "Transaction has been updated.", "success");
          } else {
            await axiosPublic.post(
              "/transactions/create-transaction/",
              transactionData
            );
            Swal.fire("Added!", "Transaction has been recorded.", "success");
          }
          // Clear form fields
          setDate(new Date().toISOString().split("T")[0]);
          setCustomer("");
          setDescription("");
          setQuantity_amount("");
          setUnitPrice_rmbRate("");
          setExpense(0);
          setDeposit(0);
          setEditingTransaction(null);
          refetch();
        } catch (error) {
          Swal.fire(
            "Error!",
            "Failed to save transaction. Try again.",
            "error"
          );
        }
      }
    });
  };

  // Handle edit
  const handleEdit = (transaction) => {
    Swal.fire({
      title: "Edit Transaction",
      text: "Are you sure you want to edit this transaction?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Blue color for "Yes" button
      cancelButtonColor: "#d33", // Red color for "Cancel" button
      confirmButtonText: "Yes, Edit",
      cancelButtonText: "Cancel", // Optional: Customize cancel button text
    }).then((result) => {
      if (result.isConfirmed) {
        // Format the date to "yyyy-MM-dd"
        const formattedDate = new Date(transaction.date)
          .toISOString()
          .split("T")[0];
        setDate(formattedDate);
        setCustomer(transaction.customer._id);
        setDescription(transaction.details);
        setDebit(transaction.debit);
        setCredit(transaction.credit);
        setEditingTransaction(transaction);

        // Show success message (optional)
        Swal.fire({
          icon: "success",
          title: "Edit Mode Activated",
          text: "You can now update the transaction's details.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  // Handle Delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33", // Red color for "Cancel" button
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "Cancel", // Optional: Customize cancel button text
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPublic.delete(`/transactions/${id}`);
          refetch(); // Refresh transaction
          Swal.fire({
            title: "Deleted!",
            text: "Transaction has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6", // Set OK button color
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete transaction.",
            icon: "error",
            confirmButtonColor: "#3085d6", // Set OK button color
          });
        }
      }
    });
  };

  return (
    <div>
      {/* container - New transaction form  */}
      <div className="bg-white shadow-lg rounded-lg w-full mx-auto mb-4 pb-2">
        {/* New Transaction Form */}
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-primary mb-2">
            {editingTransaction ? "Edit Transaction" : "New Transaction"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2 sm:gap-4">
              {/* Date  */}
              <div className="flex-1">
                <label className="block font-medium">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              {/* customer  */}
              <div className="flex-1">
                <label className="block font-medium">Customer</label>
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select Customer
                  </option>
                  {customers.map((cust) => (
                    <option key={cust._id} value={cust._id}>
                      {cust.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Description  */}
            <label className="block font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
              required
            />
            {/* Transaction Type Row */}
            <div className="flex gap-2 sm:gap-4">
              <div className="flex-1">
                <label className="block font-medium">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="expense">Expense</option>
                  <option value="deposit">Deposit</option>
                </select>
              </div>
            </div>

            {/* Other Fields in Single Row */}
            <div className="flex gap-2 sm:gap-4 mt-1">
              {transactionType === "deposit" ? (
                <>
                  <div className="flex-1">
                    <label className="block font-medium">Amount (Tk)</label>
                    <input
                      type="number"
                      value={quantity_amount}
                      onChange={(e) => setQuantity_amount(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium">RMB Rate</label>
                    <input
                      type="number"
                      value={unitPrice_rmbRate}
                      onChange={(e) => setUnitPrice_rmbRate(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium">Deposit</label>
                    <input
                      type="number"
                      value={Number(deposit).toFixed(2)} // Format to 2 decimal places
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <label className="block font-medium">Quantity</label>
                    <input
                      type="number"
                      value={quantity_amount}
                      onChange={(e) => setQuantity_amount(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium">Unit Price</label>
                    <input
                      type="number"
                      value={unitPrice_rmbRate}
                      onChange={(e) => setUnitPrice_rmbRate(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium">Expense</label>
                    <input
                      type="number"
                      value={expense}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  </div>
                </>
              )}
            </div>

            {/* submit button  */}
            <button type="submit" className="btn btn-primary w-full">
              {editingTransaction ? "Update" : "Add"} Transaction
            </button>
          </form>
        </div>
      </div>
      {/* Search and Take Action Transactions */}
      <div className="w-full mx-auto p-4 bg-base-100 shadow-lg rounded-lg mb-6">
        {/* Heading  */}
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">
          Transactions History (
          {filteredTransactions.length || transactions.length})
        </h2>
        {/* Search Field  */}
        <input
          type="text"
          placeholder="Search Transaction by customer name and date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        {/* Table for Transactions */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="bg-blue-400 text-cyan-900">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Details</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Quantity/Amount</th>
                <th className="px-4 py-2">unitPrice/rmbRate</th>
                <th className="px-4 py-2">Expense</th>
                <th className="px-4 py-2">Deposit</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {(searchTerm ? filteredTransactions : currentItems).map(
                (tx, index) => (
                  <tr
                    key={tx._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-200"
                    } text-cyan-900`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{tx.customer.name}</td>
                    <td className="px-4 py-2">{tx.details}</td>
                    <td className="px-4 py-2">
                      {new Date(tx.date)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(",", "")}
                    </td>
                    <td className="px-4 py-2">${tx.quantity_amount}</td>
                    <td className="px-4 py-2">${tx.unitPrice_rmbRate}</td>
                    <td className="px-4 py-2">${tx.expense}</td>
                    <td className="px-4 py-2">${tx.deposit}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(tx)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(tx._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
      </div>
    </div>
  );
};

export default ManageTransaction;
