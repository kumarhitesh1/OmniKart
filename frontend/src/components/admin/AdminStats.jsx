import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "../../main";

const AdminStats = () => {
  const [cod, setCod] = useState(0);
  const [online, setOnline] = useState(0);

  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [shippedOrders, setShippedOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch store statistics
  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await axios.get(`${server}/api/stats`, {
          headers: { token: Cookies.get("token") },
        });

        setCod(data.cod);
        setOnline(data.online);

        setTotalOrders(data.totalOrders);
        setPendingOrders(data.pendingOrders);
        setShippedOrders(data.shippedOrders);
        setDeliveredOrders(data.deliveredOrders);

        setData(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900">Store Stats</h2>

      {/* Order statistics */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Order Status
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total</p>

            <p className="text-3xl font-bold text-gray-900">
              {totalOrders}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Pending</p>

            <p className="text-3xl font-bold text-yellow-500">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Shipped</p>

            <p className="text-3xl font-bold text-blue-500">
              {shippedOrders}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Delivered</p>

            <p className="text-3xl font-bold text-green-500">
              {deliveredOrders}
            </p>
          </div>
        </div>
      </div>

      {/* Payment statistics */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Payment Method
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">COD</p>

            <p className="text-3xl font-bold text-gray-900">{cod}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Online</p>

            <p className="text-3xl font-bold text-blue-600">{online}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total</p>

            <p className="text-3xl font-bold text-green-600">
              {cod + online}
            </p>
          </div>
        </div>
      </div>

      {/* Products sold statistics */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Products Sold
        </h3>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm">No sales data yet</p>
          ) : (
            [...data]
              // Sort by highest sold
              .sort((a, b) => b.sold - a.sold)
              .map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <p className="w-36 md:w-48 text-xs text-gray-700 truncate shrink-0">
                    {item.name}
                  </p>

                  {/* Sales progress bar */}
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        item.sold === 0 ? "bg-gray-200" : "bg-gray-900"
                      }`}
                      style={{
                        width: `${Math.min(
                          (item.sold /
                            Math.max(...data.map((d) => d.sold), 1)) *
                            100,
                          100,
                        )}%`,
                        minWidth: item.sold > 0 ? "8px" : "0",
                      }}
                    />
                  </div>

                  <p
                    className={`text-xs font-bold w-6 text-right shrink-0 ${
                      item.sold === 0 ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {item.sold}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;