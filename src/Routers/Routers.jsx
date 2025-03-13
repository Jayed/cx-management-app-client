import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home/Home";
import Main from "../Layout/Main";
import Customers from "../Pages/Customers/Customers";
import ManageCustomer from "../Pages/Customers/ManageCustomer";
import CxVsTxSummary from "../Pages/Dashboard/CxVsTxSummary";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/customers",
        element: <Customers></Customers>,
      },
      {
        path: "/manage-customers",
        element: <ManageCustomer></ManageCustomer>,
      },
      {
        path: "/cx-vs-tx-sum",
        element: <CxVsTxSummary></CxVsTxSummary>,
      },
    ],
  },
]);
