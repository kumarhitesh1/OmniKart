import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

import { server } from "../main";

import { Package, ChevronRight } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data } = await axios.get(`${server}/api/order/all`, {
          headers: { token: Cookies.get("token") },
        });

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Package size={64} className="text-gray-300 mb-4" />

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No orders yet
        </h2>

        <p className="text-gray-500 mb-6">
          Start shopping to see your orders here
        </p>

        <button
          onClick={() => navigate("/products")}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
        Your Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 font-mono truncate w-40 md:w-auto">
                #{order._id.slice(-10).toUpperCase()}
              </p>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
              <span>
                🛍 {order.items.length} item
                {order.items.length > 1 ? "s" : ""}
              </span>

              <span>•</span>

              <span className="font-semibold text-gray-900">
                ₹ {order.subTotal.toLocaleString()}
              </span>

              <span>•</span>

              <span>
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <button
              onClick={() => navigate(`/order/${order._id}`)}
              className="w-full md:w-auto bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
            >
              View Details <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;