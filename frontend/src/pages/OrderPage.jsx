import { useState, useEffect } from "react";

import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import axios from "axios";

import Cookies from "js-cookie";

import { server } from "../main";

import { UserData } from "../context/UserContext";

const OrderPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = UserData();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch order details
  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data } = await axios.get(
          `${server}/api/order/${id}`,
          {
            headers: {
              token: Cookies.get("token"),
            },
          }
        );

        setOrder(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  // Order not found
  if (!order)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Order not found
        </h2>

        <button
          onClick={() => navigate("/orders")}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );

  // Restrict unauthorized access
  if (
    user._id !== order.user._id &&
    user.role !== "admin"
  )
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-2xl font-bold text-red-500 mb-4">
          This is not your order
        </p>

        <Link
          to="/"
          className="text-blue-500 underline"
        >
          Go Home
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Order Details
        </h1>

        {/* Print order */}
        <button
          onClick={() => window.print()}
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          🖨 Print
        </button>
      </div>

      {/* Order and shipping details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Order info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">
            Order Info
          </h2>

          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">
              ID:
            </span>{" "}
            {order._id}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">
              Status:
            </span>{" "}
            <span
              className={`font-bold ${
                order.status === "Pending"
                  ? "text-yellow-600"
                  : order.status === "Shipped"
                    ? "text-blue-600"
                    : "text-green-600"
              }`}
            >
              {order.status}
            </span>
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">
              Payment:
            </span>{" "}
            {order.method.toUpperCase()}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">
              Total:
            </span>{" "}
            ₹ {order.subTotal.toLocaleString()}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">
              Placed:
            </span>{" "}
            {new Date(
              order.createdAt
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Shipping info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">
            Shipping Info
          </h2>

          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">
              Address:
            </span>{" "}
            {order.address}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">
              Phone:
            </span>{" "}
            {order.phone}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">
              Email:
            </span>{" "}
            {order.user?.email}
          </p>
        </div>
      </div>

      {/* Ordered items */}
      <h2 className="font-bold text-gray-900 text-xl mb-4">
        Items
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {order.items.map((item, i) => (
          <Link
            to={`/product/${item.product._id}`}
            key={i}
          >
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
              {/* Product image */}
              <img
                src={item.product.images[0]?.url}
                alt={item.product.title}
                className="w-full h-32 object-contain rounded-lg bg-gray-50 mb-2"
              />

              {/* Product details */}
              <p className="text-xs font-semibold text-gray-900 truncate">
                {item.product.title}
              </p>

              <p className="text-xs text-gray-500">
                Qty: {item.quantity}
              </p>

              <p className="text-xs font-bold text-gray-900">
                ₹{" "}
                {item.product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;