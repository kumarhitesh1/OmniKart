import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { UserProvider } from "./context/UserContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";

import { Toaster } from "react-hot-toast";

export const server = import.meta.env.VITE_SERVER_URL;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <App />
          <Toaster />
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  </StrictMode>
);