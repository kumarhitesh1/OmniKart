import { useState, useEffect } from "react";
import { ProductData } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const {
    products,
    loading,
    search,
    setSearch,
    categories,
    category,
    setCategory,
    price,
    setPrice,
    page,
    setPage,
    totalPages,
  } = ProductData();

  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setSearch("");
    setCategory("");
    setPrice("");
    setPage(1);
  }, []);

  const clearFilter = () => {
    setSearch("");
    setCategory("");
    setPrice("");
    setPage(1);
    setFilterOpen(false);
  };

  const FilterContent = () => (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Filters</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white"
        >
          <option value="">All</option>

          {categories &&
            categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sort by Price
        </label>

        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white"
        >
          <option value="">Default</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      <button
        onClick={clearFilter}
        className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Clear Filters
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen relative">
      <div className="hidden md:block w-56 shrink-0 border-r border-gray-200 p-5 bg-white">
        <FilterContent />
      </div>

      <button
        onClick={() => setFilterOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-gray-900 text-white px-5 py-3 rounded-full shadow-lg font-medium text-sm"
      >
        🔧 Filters
      </button>

      {filterOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setFilterOpen(false)}
          />

          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>

              <button
                onClick={() => setFilterOpen(false)}
                className="text-gray-500 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white"
              >
                <option value="">All</option>

                {categories &&
                  categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by Price
              </label>

              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white"
              >
                <option value="">Default</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearFilter}
                className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>

              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex-1 p-4 md:p-6 bg-gray-50">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  latest="no"
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  ← Previous
                </button>
              )}

              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              {page < totalPages && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-xl mb-2">No products found</p>

            <button
              onClick={clearFilter}
              className="text-sm underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;