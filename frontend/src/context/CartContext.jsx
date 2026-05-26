import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  // Fetch cart data
  async function fetchCart() {
    try {
      const { data } = await axios.get(`${server}/api/cart/all`, {
        headers: { token: Cookies.get("token") },
      });

      setCart(data.cart);
      setTotalItem(data.sumofQuantities);
      setSubTotal(data.subTotal);
    } catch (error) {
      // Reset cart if user is not logged in
      setCart([]);
      setTotalItem(0);
      setSubTotal(0);
    }
  }

  // Add product to cart
  async function addToCart(productId) {
    try {
      const { data } = await axios.post(
        `${server}/api/cart/add`,
        { product: productId },
        { headers: { token: Cookies.get("token") } },
      );

      toast.success(data.message);

      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Update cart quantity
  async function updateCart(action, id) {
    try {
      await axios.post(
        `${server}/api/cart/update?action=${action}`,
        { id },
        { headers: { token: Cookies.get("token") } },
      );

      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Remove product from cart
  async function removeFromCart(id) {
    try {
      const { data } = await axios.get(`${server}/api/cart/remove/${id}`, {
        headers: { token: Cookies.get("token") },
      });

      toast.success(data.message);

      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Load cart on app start
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItem,
        subTotal,
        fetchCart,
        addToCart,
        updateCart,
        removeFromCart,
        setTotalItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const CartData = () => useContext(CartContext);