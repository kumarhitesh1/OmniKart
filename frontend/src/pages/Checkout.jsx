import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import Cookies from "js-cookie";

import toast from "react-hot-toast";

import { server } from "../main";

import { Trash2 } from "lucide-react";

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [newAddress, setNewAddress] = useState({
    address: "",
    phone: "",
  });

  const navigate = useNavigate();

  // Fetch saved addresses
  async function fetchAddresses() {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: { token: Cookies.get("token") },
      });

      setAddresses(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Load addresses on page load
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Add new address
  const addAddressHandler = async () => {
    if (!newAddress.address || !newAddress.phone) {
      toast.error("Please fill all fields");

      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        {
          address: newAddress.address,
          phone: newAddress.phone,
        },
        {
          headers: { token: Cookies.get("token") },
        }
      );

      toast.success(data.message);

      setNewAddress({
        address: "",
        phone: "",
      });

      setModalOpen(false);

      fetchAddresses();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Delete address
  const deleteHandler = async (id) => {
    if (!confirm("Delete this address?")) return;

    try {
      const { data } = await axios.delete(
        `${server}/api/address/${id}`,
        {
          headers: { token: Cookies.get("token") },
        }
      );

      toast.success(data.message);

      fetchAddresses();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Checkout
      </h1>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Address list */}
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <p className="font-semibold text-gray-900 mb-1">
                  {addr.address}
                </p>

                <p className="text-gray-500 text-sm mb-4">
                  📞 {addr.phone}
                </p>

                <div className="flex gap-2">
                  {/* Continue to payment */}
                  <button
                    onClick={() => navigate(`/payment/${addr._id}`)}
                    className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Use Address
                  </button>

                  {/* Delete address */}
                  <button
                    onClick={() => deleteHandler(addr._id)}
                    className="px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3">
              No addresses found. Add one below.
            </p>
          )}
        </div>
      )}

      {/* Open address modal */}
      <button
        onClick={() => setModalOpen(true)}
        className="mt-6 border border-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        + Add New Address
      </button>

      {/* Address modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Add New Address
            </h2>

            {/* Address input */}
            <input
              placeholder="Full Address"
              value={newAddress.address}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  address: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-500 mb-3"
            />

            {/* Phone input */}
            <input
              type="number"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  phone: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-500 mb-5"
            />

            <div className="flex gap-3">
              {/* Save address */}
              <button
                onClick={addAddressHandler}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Save Address
              </button>

              {/* Close modal */}
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;