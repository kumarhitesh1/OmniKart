import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserData } from "../context/UserContext";

import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminStats from "../components/admin/AdminStats";

import {
  Package,
  ShoppingBag,
  BarChart2,
  Menu,
} from "lucide-react";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = UserData();

  const navigate = useNavigate();

  // Redirect non-admin users
  if (user && user.role !== "admin") {
    navigate("/");
    return null;
  }

  // Sidebar pages
  const pages = [
    {
      key: "products",
      label: "Products",
      icon: <Package size={18} />,
    },

    {
      key: "orders",
      label: "Orders",
      icon: <ShoppingBag size={18} />,
    },

    {
      key: "stats",
      label: "Stats",
      icon: <BarChart2 size={18} />,
    },
  ];

  // Render selected admin page
  const renderPage = () => {
    switch (selectedPage) {
      case "products":
        return <AdminProducts />;

      case "orders":
        return <AdminOrders />;

      case "stats":
        return <AdminStats />;

      default:
        return <AdminProducts />;
    }
  };

  // Handle sidebar navigation
  const handleSelect = (key) => {
    setSelectedPage(key);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative top-0 left-0 h-full z-40
          w-56 bg-white border-r border-gray-200 p-4
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-6 px-2">
          Admin Panel
        </h2>

        {/* Sidebar menu */}
        <div className="space-y-1">
          {pages.map((p) => (
            <button
              key={p.key}
              onClick={() => handleSelect(p.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                selectedPage === p.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          {/* Open sidebar button */}
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-gray-900" />
          </button>

          <h2 className="font-bold text-gray-900 capitalize">
            {selectedPage}
          </h2>

          <div className="w-6" />
        </div>

        {/* Page content */}
        <div className="p-4 md:p-6">{renderPage()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;