import { useNavigate } from "react-router-dom";

import { CartData } from "../context/CartContext";

import { Trash2, ShoppingCart } from "lucide-react";

const Cart = () => {
  const {
    cart,
    totalItem,
    subTotal,
    updateCart,
    removeFromCart,
  } = CartData();

  const navigate = useNavigate();

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>

        <p className="text-gray-500 mb-6">
          Add some products to get started
        </p>

        {/* Navigate to products page */}
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Cart
      </h1>

      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              {/* Product image */}
              <img
                src={item.product.images[0].url}
                alt={item.product.title}
                className="w-20 h-20 object-contain cursor-pointer rounded-lg bg-gray-50"
                onClick={() => navigate(`/product/${item.product._id}`)}
              />

              {/* Product details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {item.product.title}
                </p>

                <p className="text-gray-500 text-sm">
                  ₹ {item.product.price.toLocaleString()}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCart("dec", item._id)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"
                >
                  -
                </button>

                <span className="w-6 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateCart("inc", item._id)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"
                >
                  +
                </button>
              </div>

              {/* Item subtotal */}
              <p className="font-bold text-gray-900 w-24 text-right">
                ₹ {item.itemSubTotal.toLocaleString()}
              </p>

              {/* Remove item */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 hover:text-red-600 transition-colors ml-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-72 bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Summary
          </h2>

          <hr className="mb-4" />

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Total Items</span>
            <span>{totalItem}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Subtotal</span>
            <span>₹ {subTotal.toLocaleString()}</span>
          </div>

          <hr className="mb-4" />

          {/* Total price */}
          <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
            <span>Total</span>
            <span>₹ {subTotal.toLocaleString()}</span>
          </div>

          {/* Checkout button */}
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;