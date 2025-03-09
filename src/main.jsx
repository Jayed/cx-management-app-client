import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./Routers/Routers.jsx";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="max-w-screen-xl mx-auto">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  </React.StrictMode>
);
