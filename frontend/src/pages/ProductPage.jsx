import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductData } from "../context/ProductContext";
import { UserData } from "../context/UserContext";
import { CartData } from "../context/CartContext";
import { Trash2, ShoppingCart, ChevronRight } from "lucide-react";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { product, relatedProduct, productLoading, fetchProduct } =
    ProductData();

  const { isAuth } = UserData();

  const { addToCart, cart, updateCart, removeFromCart } = CartData();

  const [mainImage, setMainImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchProduct(id);
    setMainImage(0);
    window.scrollTo(0, 0);
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({ x, y });
  };

  const cartItem = cart.find((item) => item.product._id === id);

  if (productLoading)
    return (
      <div className="flex justify-center py-40">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-xl text-gray-500">Product not found</p>

        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        <div className="flex-1">
          <div
            className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center h-96 mb-4 border border-gray-100 overflow-hidden cursor-zoom-in relative"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images[mainImage]?.url}
              alt={product.title}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: zoomed ? "scale(2)" : "scale(1)",
              }}
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`thumb-${index}`}
                  onClick={() => setMainImage(index)}
                  className={`w-16 h-16 object-contain rounded-lg cursor-pointer border-2 bg-gray-50 shrink-0 transition-all ${
                    mainImage === index
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
            {product.category}
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.title}
          </h1>

          <p className="text-gray-600 mb-5 leading-relaxed">
            {product.about}
          </p>

          <p className="text-4xl font-bold text-gray-900 mb-3">
            ₹ {product.price.toLocaleString()}
          </p>

          <p className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ In Stock ({product.stock} left)
              </span>
            ) : (
              <span className="text-red-500 font-medium">
                ✗ Out of Stock
              </span>
            )}
          </p>

          {isAuth ? (
            product.stock > 0 ? (
              cartItem ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2">
                      <button
                        onClick={() => removeFromCart(cartItem._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>

                      <button
                        onClick={() => updateCart("dec", cartItem._id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-bold text-lg"
                      >
                        -
                      </button>

                      <span className="text-xl font-bold w-6 text-center">
                        {cartItem.quantity}
                      </span>

                      <button
                        onClick={() => updateCart("inc", cartItem._id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-bold text-lg"
                      >
                        +
                      </button>
                    </div>

                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      ✓ Added to Cart
                    </span>
                  </div>

                  <button
                    onClick={() => navigate("/cart")}
                    className="w-fit border border-gray-900 text-gray-900 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-900 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Go to Cart
                    <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product._id)}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors"
                >
                  Add to Cart
                </button>
              )
            ) : (
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-8 py-3 rounded-xl font-semibold text-lg cursor-not-allowed"
              >
                Out of Stock
              </button>
            )
          ) : (
            <p
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Please login to add items to cart
            </p>
          )}
        </div>
      </div>

      {relatedProduct && relatedProduct.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedProduct.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="bg-gray-50 rounded-lg h-36 flex items-center justify-center mb-3">
                  <img
                    src={p.images[0].url}
                    alt={p.title}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <p className="text-sm font-semibold text-gray-900 truncate">
                  {p.title}
                </p>

                <p className="text-sm font-bold text-gray-900 mt-1">
                  ₹ {p.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;