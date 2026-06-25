import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatAssistant from "./components/ChatAssistant";

import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Products from "./pages/Products";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import OrderPage from "./pages/OrderPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import { UserData } from "./context/UserContext";

const App = () => {
  const { isAuth, loading } = UserData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductPage />} />

        <Route path="/cart" element={isAuth ? <Cart /> : <Login />} />
        <Route
          path="/checkout"
          element={isAuth ? <Checkout /> : <Login />}
        />
        <Route
          path="/payment/:id"
          element={isAuth ? <Payment /> : <Login />}
        />

        <Route path="/orders" element={isAuth ? <Orders /> : <Login />} />
        <Route
          path="/order/:id"
          element={isAuth ? <OrderPage /> : <Login />}
        />

        <Route
          path="/admin/dashboard"
          element={isAuth ? <AdminDashboard /> : <Login />}
        />

        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <ChatAssistant />
    </BrowserRouter>
  );
};

export default App;