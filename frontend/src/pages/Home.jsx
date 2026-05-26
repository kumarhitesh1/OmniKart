import { useNavigate } from "react-router-dom";

import { ProductData } from "../context/ProductContext";

import ProductCard from "../components/ProductCard";

const Home = () => {
  const navigate = useNavigate();

  const { newProd, loading } = ProductData();

  return (
    <div>
      {/* Hero section */}
      <div
        className="relative h-[85vh] flex items-center justify-center text-center text-white"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
        }}
      >
        <div className="px-4">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
            Welcome to <br />

            <span className="text-blue-400">
              OmniKart
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
            Discover amazing products and deals just for you
          </p>

          {/* Navigate to products page */}
          <button
            onClick={() => navigate("/products")}
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Latest products section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Latest Products
        </h2>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : newProd && newProd.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Latest product cards */}
            {newProd.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                latest="yes"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No products yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;