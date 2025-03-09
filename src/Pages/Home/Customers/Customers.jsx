import React, { useEffect, useState } from "react";
import useCustomers from "../../../Hooks/useCustomers";

const Customers = () => {
  // Fetch customers using the custom hook
  const [customers, refetch, isPending, isError, error] = useCustomers();

  console.log("Fetched customers:", customers); // Debugging

  // Ensure customers is always an array
  const customerList = Array.isArray(customers) ? customers : [];

  if (isPending) {
    return <p className="text-center text-blue-500">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>

      {customerList.length === 0 ? (
        <p className="text-center text-gray-600">No customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  Customer ID
                </th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Mobile</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {customerList.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.customerId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.mobile}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
