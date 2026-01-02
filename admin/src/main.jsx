import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { BrowserRouter } from "react-router";
import axiosInstance from "./lib/api";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY eksik");
}

const queryClient = new QueryClient();

// Axios Interceptor Component
function AxiosInterceptor({ children }) {
  const { getToken } = useAuth();

  React.useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, [getToken]);

  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkKey}>
        <AxiosInterceptor>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AxiosInterceptor>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);