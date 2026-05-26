import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { server } from "../main";
import { CartData } from "../context/CartContext";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, subTotal, fetchCart } = CartData();

  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAddress() {
      try {
        const { data } = await axios.get(`${server}/api/address/${id}`, {
          headers: { token: Cookies.get("token") },
        });

        setAddress(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchAddress();
  }, [id]);

  const paymentHandler = async () => {
    if (!method) return toast.error("Please select a payment method");

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/order/new/cod`,
        {
          method,
          phone: address.phone,
          address: address.address,
        },
        {
          headers: { token: Cookies.get("token") },
        },
      );

      toast.success(data.message);

      // Refresh cart after successful order
      await fetchCart();

      navigate("/orders");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Confirm Order
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <h2 className="font-semibold text-gray-900 mb-4">Your Items</h2>

        <div className="space-y-3">
          {cart.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img
                src={item.product.images[0].url}
                alt={item.product.title}
                className="w-14 h-14 object-contain rounded-lg bg-gray-50"
              />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {item.product.title}
                </p>

                <p className="text-xs text-gray-500">
                  ₹ {item.product.price.toLocaleString()} × {item.quantity}
                </p>
              </div>

              <p className="font-bold text-sm text-gray-900">
                ₹ {item.itemSubTotal.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <div className="flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>₹ {subTotal.toLocaleString()}</span>
        </div>
      </div>

      {address && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
          <h2 className="font-semibold text-gray-900 mb-3">
            Delivery Address
          </h2>

          <p className="text-gray-700">{address.address}</p>

          <p className="text-gray-500 text-sm mt-1">
            📞 {address.phone}
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">
          Payment Method
        </h2>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-500 bg-white"
        >
          <option value="">Select Method</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      <button
        onClick={paymentHandler}
        disabled={loading || !method || !address}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Payment;