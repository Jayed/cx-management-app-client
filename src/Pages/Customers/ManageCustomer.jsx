import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useCustomers from "../../Hooks/useCustomers";
import Pagination from "../../Components/Pagination/Pagination";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ManageCustomer = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const axiosPublic = useAxiosPublic();

  // Need to set customers in state
  const [customers, setCustomers] = useState([]);
  const [fetchedCustomers, refetch] = useCustomers(); // Fetch customers

  // Set customers in state when fetchedCustomers changes
  useEffect(() => {
    if (fetchedCustomers) {
      // Sort customers by name in ascending order (A-Z)
      const sortedCustomers = fetchedCustomers.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCustomers(sortedCustomers);
    }
  }, [fetchedCustomers]);

  // console.log("Customers:", customers);
  // console.log("Customer count:", customers.length);

  // State for pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  // Update pagination variables when customers change
  useEffect(() => {
    if (customers?.length > 0) {
      SetPaginationVariables();
    }
  }, [customers, itemOffset]); // Trigger when `customers` or `itemOffset` changes

  const SetPaginationVariables = () => {
    if (customers?.length > 0) {
      const endOffset = itemOffset + itemsPerPage;
      setPageCount(Math.ceil(customers.length / itemsPerPage));
      setCurrentItems(customers.slice(itemOffset, endOffset));
    } else {
      setCurrentItems([]); // Set to empty array if no customers
    }
  };

  // Handle pagination click
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % customers.length;
    setItemOffset(newOffset);
  };

  // console.log("current Items: ", currentItems);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers([]);
      return;
    }
    const searchWords = searchTerm.toLowerCase().split(" ");
    const results = customers.filter((cust) =>
      searchWords.every(
        (word) =>
          cust.name?.toLowerCase().includes(word) ||
          cust.mobile?.toLowerCase().includes(word) ||
          cust.address?.toLowerCase().includes(word)
      )
    );

    setFilteredCustomers(results);
  }, [searchTerm, customers]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerData = {
      name,
      mobile,
      email,
      address,
    };

    // console.log("customerData: ", customerData);

    Swal.fire({
      title: "Confirm Customer",
      text: "Do you want to save this customer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Editing Customer
          if (editingCustomer) {
            await axiosPublic.put(
              `/customers/${editingCustomer._id}`,
              customerData
            );
            Swal.fire({
              title: "Updated!",
              text: "Customer details have been updated.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
          } else {
            await axiosPublic.post("/customers/create-customer/", customerData);
            Swal.fire({
              title: "Added!",
              text: "Customer has been added successfully.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
          }

          // Clear form fields
          setName("");
          setMobile("");
          setEmail("");
          setAddress("");
          setEditingCustomer(null);
          // Refetch customers to update the list
          refetch();
        } catch (error) {
          console.error("Error submitting customer data:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to save customer. Try again.",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    });
  };

  // Handle edit
  const handleEdit = (customer) => {
    Swal.fire({
      title: "Edit Customer",
      text: "Are you sure you want to edit this customer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Blue color for "Yes" button
      cancelButtonColor: "#d33", // Red color for "Cancel" button
      confirmButtonText: "Yes, Edit",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setName(customer.name);
        setMobile(customer.mobile);
        setEmail(customer.email);
        setAddress(customer.address);
        setEditingCustomer(customer);

        // Show success message (optional)
        Swal.fire({
          icon: "success",
          title: "Edit Mode Activated",
          text: "You can now update the customer's details.",
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
      confirmButtonColor: "#3085d6", // Blue color for "Yes" button
      cancelButtonColor: "#d33", // Red color for "Cancel" button
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPublic.delete(`/customers/${id}`);
          refetch(); // Refresh customer list
          Swal.fire({
            title: "Deleted!",
            text: "Customer has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete customer. Please try again.",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    });
  };

  return (
    <div>
      {/* container - New Customer form  */}
      <div className="bg-white shadow-lg rounded-lg w-full mx-auto mb-4 pb-2">
        {/* New Customer Creation Form */}
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-primary mb-2">
            {editingCustomer ? "Edit Customer" : "New Customer"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-cyan-900 text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-cyan-900 text-sm font-medium mb-1">
                Mobile
              </label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-cyan-900 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-cyan-900 text-sm font-medium mb-1">
                Address
              </label>
              <textarea
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
                className="textarea textarea-bordered w-full resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary w-full">
                {editingCustomer ? "Update" : "Add"} Customer
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search and Take Action Customers */}
      <div className="w-full mx-auto p-4 bg-base-100 shadow-lg rounded-lg mb-6">
        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">
          Customers History ({filteredCustomers.length || customers.length})
        </h2>

        {/* Search Field */}
        <input
          type="text"
          placeholder="Search by Customer Name or Mobile Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        {/* Table for Customers */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="bg-blue-400 text-cyan-900">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Cx-ID</th>
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {(searchTerm ? filteredCustomers : currentItems).map(
                (cust, index) => (
                  <tr
                    key={cust._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-200"
                    } text-cyan-900`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{cust.customerId}</td>
                    <td className="px-4 py-2">{cust.name}</td>
                    <td className="px-4 py-2">{cust.mobile}</td>
                    <td className="px-4 py-2">{cust.email}</td>
                    <td className="px-4 py-2">{cust.address}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(cust)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(cust._id)}
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

export default ManageCustomer;
