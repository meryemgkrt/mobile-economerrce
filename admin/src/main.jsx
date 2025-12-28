import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { BrowserRouter } from "react-router";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY eksik");
}

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkKey}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
        
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);
