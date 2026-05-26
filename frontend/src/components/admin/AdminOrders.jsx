import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { server } from "../../main";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all orders
  async function fetchOrders() {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        headers: { token: Cookies.get("token") },
      });

      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, status) => {
    // Update UI instantly
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status } : order,
      ),
    );

    try {
      const { data } = await axios.post(
        `${server}/api/order/${orderId}`,
        { status },
        { headers: { token: Cookies.get("token") } },
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);

      // Restore orders if update fails
      fetchOrders();
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(
    (o) =>
      o.user.email.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase()),
  );

  // Get status badge color
  const statusColor = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Shipped") return "bg-blue-100 text-blue-700";

    return "bg-green-100 text-green-700";
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Manage Orders
      </h2>

      <input
        placeholder="Search by email or order ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-gray-500 mb-5"
      />

      {loading ? (
        // Loading spinner
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <>
          {/* Desktop orders table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left text-gray-600">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {order._id.slice(0, 10)}...
                      </Link>
                    </td>

                    <td className="py-3 pr-4">{order.user.email}</td>

                    <td className="py-3 pr-4">
                      ₹ {order.subTotal.toLocaleString()}
                    </td>

                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3 pr-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile order cards */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                {/* Order header */}
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/order/${order._id}`}
                    className="text-blue-500 text-sm font-mono"
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </Link>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order details */}
                <p className="text-sm text-gray-600 mb-1">
                  📧 {order.user.email}
                </p>

                <p className="text-sm font-bold text-gray-900 mb-1">
                  ₹ {order.subTotal.toLocaleString()}
                </p>

                <p className="text-xs text-gray-400 mb-3">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                {/* Change order status */}
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;