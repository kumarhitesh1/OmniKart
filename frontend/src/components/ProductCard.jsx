import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, latest }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Product image */}
      <div className="relative h-52 bg-gray-50 flex items-center justify-center p-4">
        <img
          src={product.images[0].url}
          alt={product.title}
          loading="lazy"
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* New product badge */}
        {latest === "yes" && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            New
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
          {product.title.slice(0, 40)}
        </h3>

        <p className="text-gray-500 text-xs mb-2 truncate">
          {product.about.slice(0, 50)}
        </p>

        <p className="text-gray-900 font-bold text-base mb-3">
          ₹ {product.price.toLocaleString()}
        </p>

        {/* View product button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
          className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          View Product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;