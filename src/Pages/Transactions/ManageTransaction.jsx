import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useCustomers from "../../Hooks/useCustomers";
import Pagination from "../../Components/Pagination/Pagination";
import useTransactions from "../../Hooks/useTransactions";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ManageTransaction = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default current date
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const axiosPublic = useAxiosPublic();
  const [customers] = useCustomers();
  // console.log(customer);

  // Need to set transaction in state
  const [transactions, setTransactions] = useState([]);
  const [fetchedTransactions, refetch] = useTransactions();

  // Set transactions in state when fetchedTransactions changes
  useEffect(() => {
    if (fetchedTransactions) {
      // Sort transactions by date in descending order (newest first)
      const sortedTransactions = fetchedTransactions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Descending order
      });
      setTransactions(sortedTransactions);
    }
  }, [fetchedTransactions]);

  console.log("Transaction:", transactions);
  console.log("Transaction length:", transactions.length);

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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = {
      transactionID: transactions.length + 1, // Auto-increment logic
      date,
      details: description,
      customer,
      debit: parseFloat(debit) || 0,
      credit: parseFloat(credit) || 0,
    };
    console.log("transactionData: ", transactionData);

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
          // Editing Transaction
          if (editingTransaction) {
            await axiosPublic.put(
              `/transactions/${editingTransaction._id}`,
              transactionData
            );
            Swal.fire({
              title: "Updated!",
              text: "Transaction has been updated.",
              icon: "success",
              confirmButtonColor: "#3085d6", // Set OK button color
            });
          } else {
            await axiosPublic.post(
              "/transactions/create-transaction/",
              transactionData
            );
            Swal.fire({
              title: "Added!",
              text: "Transaction has been recorded.",
              icon: "success",
              confirmButtonColor: "#3085d6", // Set OK button color
            });
          }

          // Clear form fields
          setDate(new Date().toISOString().split("T")[0]);
          setCustomer("");
          setDescription("");
          setDebit("");
          setCredit("");
          setEditingTransaction(null);
          // Refetch transactions to update the list
          refetch(); // Call refetch to reload transactions
        } catch (error) {
          console.error("Error submitting transaction:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to save transaction. Try again.",
            icon: "error",
            confirmButtonColor: "#3085d6", // Set OK button color
          });
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

  // Handle delete
  // const handleDelete = async (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "This action cannot be undone!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         await axiosPublic.delete(`/transactions/${id}`);
  //         SetPaginationVariables();
  //         Swal.fire("Deleted!", "Transaction has been deleted.", "success");
  //       } catch (error) {
  //         Swal.fire("Error!", "Failed to delete transaction.", "error");
  //       }
  //     }
  //   });
  // };
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
            {/* Row 1: Date & Customer */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* date  */}
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Date
                </label>
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
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Customer
                </label>
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

            {/* Row 2: Description (Auto-Expanding) */}
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter transaction details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="2"
                className="textarea textarea-bordered w-full min-h-[80px] resize-none overflow-hidden"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                required
              />
            </div>

            {/* Row 3: Debit & Credit */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* debit  */}
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Debit ($)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={debit}
                  onChange={(e) => setDebit(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              {/* credit  */}
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Credit ($)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Row 4: Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary w-full">
                {editingTransaction ? "Update" : "Add"} Transaction
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search and Take Action Transactions
      <div className="w-full mx-auto p-4 bg-base-100 shadow-lg rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">
          Search Transactions (
          {filteredTransactions.length || transactions.length})
        </h2>

        <input
          type="text"
          placeholder="Search Transaction by customer name and date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        <ul className="space-y-2">
          {(searchTerm ? filteredTransactions : currentItems).map((tx) => (
            <li key={tx._id} className="p-4 bg-base-200 rounded-lg">
              <p>
                <strong>{tx.customer.name}</strong> - {tx.details}
              </p>
              <p>
                Date: {tx.date} | Debit: ${tx.debit} | Credit: ${tx.credit}
              </p>
              <button
                onClick={() => handleEdit(tx)}
                className="btn btn-sm btn-outline btn-primary"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tx._id)}
                className="btn btn-sm btn-outline btn-error ml-2"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
      </div> */}
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
              <tr className="bg-blue-400">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Details</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Debit</th>
                <th className="px-4 py-2">Credit</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {(searchTerm ? filteredTransactions : currentItems).map(
                (tx, index) => (
                  <tr
                    key={tx._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
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
                    <td className="px-4 py-2">${tx.debit}</td>
                    <td className="px-4 py-2">${tx.credit}</td>
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
