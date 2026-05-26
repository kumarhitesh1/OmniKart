import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { CartData } from "../context/CartContext";
import { ProductData } from "../context/ProductContext";

import {
  Search,
  X,
  ShoppingCart,
  Menu,
  Home,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const { isAuth, logoutUser, user } = UserData();
  const { totalItem } = CartData();

  const { search, setSearch, setCategory, setPrice, setPage } =
    ProductData();

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle product search
  const handleSearch = (e) => {
    setSearch(e.target.value);

    if (window.location.pathname !== "/products") {
      navigate("/products");
    }
  };

  // Toggle search bar
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);

    if (searchOpen) setSearch("");
  };

  // Navigate between pages
  const handleNavigate = (path) => {
    if (path === "/" && window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
    }

    setMenuOpen(false);
    setSearchOpen(false);
  };

  // Reset filters and open products page
  const handleProductsClick = () => {
    setSearch("");
    setCategory("");
    setPrice("");
    setPage(1);

    navigate("/products");

    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Navbar main section */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => handleNavigate("/")}
          className="flex items-center gap-2 cursor-pointer -ml-2"
        >
          <img src="/favicon.svg" alt="OK" className="h-14 w-14" />

          <span className="font-bold leading-none" style={{ fontSize: "30px" }}>
            <span style={{ color: "#1b2a6b" }}>Omni</span>
            <span style={{ color: "#4f7ef7" }}>Kart</span>
          </span>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search bar */}
          <div className="flex items-center gap-2">
            {searchOpen && (
              <input
                autoFocus
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search products..."
                className="border border-gray-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-gray-500 w-48"
              />
            )}

            <button
              onClick={toggleSearch}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Navigation links */}
          <span
            onClick={() => handleNavigate("/")}
            className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium"
          >
            Home
          </span>

          <span
            onClick={handleProductsClick}
            className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium"
          >
            Products
          </span>

          {/* Cart button */}
          <span
            onClick={() => handleNavigate("/cart")}
            className="cursor-pointer relative"
          >
            <ShoppingCart size={24} className="text-gray-700" />

            {totalItem > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItem}
              </span>
            )}
          </span>

          {/* Auth actions */}
          {isAuth ? (
            <div className="flex items-center gap-4">
              <span
                onClick={() => handleNavigate("/orders")}
                className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium"
              >
                Orders
              </span>

              {/* Admin link */}
              {user && user.role === "admin" && (
                <span
                  onClick={() => handleNavigate("/admin/dashboard")}
                  className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium"
                >
                  Admin
                </span>
              )}

              {/* Logout button */}
              <button
                onClick={() => logoutUser(navigate)}
                className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            // Login button
            <button
              onClick={() => handleNavigate("/login")}
              className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <LogIn size={16} /> Login
            </button>
          )}
        </div>

        {/* Mobile navbar actions */}
        <div className="flex md:hidden items-center gap-4">
          {/* Mobile search toggle */}
          <button onClick={toggleSearch} className="text-gray-700">
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Mobile cart button */}
          <span
            onClick={() => handleNavigate("/cart")}
            className="cursor-pointer relative"
          >
            <ShoppingCart size={24} className="text-gray-700" />

            {totalItem > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItem}
              </span>
            )}
          </span>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X size={24} className="text-gray-900" />
            ) : (
              <Menu size={24} className="text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          searchOpen ? "max-h-16 py-2 px-4" : "max-h-0"
        }`}
      >
        <input
          autoFocus={searchOpen}
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-gray-400 bg-gray-50"
        />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="md:hidden fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl flex flex-col p-6">
            {/* Mobile menu header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <img
                  src="/favicon.svg"
                  alt="OmniKart"
                  className="h-8 w-8 object-contain"
                />

                <span className="font-bold text-lg">
                  <span style={{ color: "#1b2a6b" }}>Omni</span>
                  <span style={{ color: "#4f7ef7" }}>Kart</span>
                </span>
              </div>

              {/* Close menu button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile menu links */}
            <div className="flex flex-col gap-2">
              <span
                onClick={() => handleNavigate("/")}
                className="cursor-pointer text-gray-700 font-medium py-3 px-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <Home size={18} /> Home
              </span>

              <span
                onClick={handleProductsClick}
                className="cursor-pointer text-gray-700 font-medium py-3 px-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <Package size={18} /> Products
              </span>

              {isAuth ? (
                <>
                  {/* Orders link */}
                  <span
                    onClick={() => handleNavigate("/orders")}
                    className="cursor-pointer text-gray-700 font-medium py-3 px-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <ClipboardList size={18} /> Orders
                  </span>

                  {/* Admin link */}
                  {user && user.role === "admin" && (
                    <span
                      onClick={() => handleNavigate("/admin/dashboard")}
                      className="cursor-pointer text-gray-700 font-medium py-3 px-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3"
                    >
                      <Settings size={18} /> Admin
                    </span>
                  )}

                  {/* Logout button */}
                  <button
                    onClick={() => {
                      logoutUser(navigate);
                      setMenuOpen(false);
                    }}
                    className="bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors mt-4 flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                // Login button
                <button
                  onClick={() => handleNavigate("/login")}
                  className="bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors mt-4 flex items-center justify-center gap-2"
                >
                  <LogIn size={18} /> Login
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;