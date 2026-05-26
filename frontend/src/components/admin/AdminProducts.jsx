import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { server } from "../../main";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const [stockModal, setStockModal] = useState(null);
  const [newStock, setNewStock] = useState("");

  const [showForm, setShowForm] = useState(false);

  // Product form data
  const [formData, setFormData] = useState({
    title: "",
    about: "",
    category: "",
    price: "",
    stock: "",
    images: null,
  });

  // Fetch products
  async function fetchProducts() {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${server}/api/product/all?page=${page}&search=${search}&category=${category}`,
      );

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Update product stock
  const updateStock = async (id) => {
    if (!newStock) return toast.error("Enter stock value");

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { stock: newStock },
        {
          headers: { token: Cookies.get("token") },
        },
      );

      toast.success(data.message);

      setStockModal(null);
      setNewStock("");

      fetchProducts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Fetch products on filter change
  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  // Create new product
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      toast.error("Please select images");
      return;
    }

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        for (let i = 0; i < value.length; i++) {
          form.append("files", value[i]);
        }
      } else {
        form.append(key, value);
      }
    });

    try {
      const { data } = await axios.post(`${server}/api/product/new`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Cookies.get("token"),
        },
      });

      toast.success(data.message);

      setShowForm(false);

      setFormData({
        title: "",
        about: "",
        category: "",
        price: "",
        stock: "",
        images: null,
      });

      fetchProducts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900">All Products</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Search and category filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 flex-1 min-w-40"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white"
        >
          <option value="">All Categories</option>

          {categories &&
            categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>

        {/* Clear filters */}
        {(search || category) && (
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setPage(1);
            }}
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
          >
            Clear ✕
          </button>
        )}
      </div>

      {/* Add product form */}
      {showForm && (
        <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-white shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">New Product</h3>

          <form onSubmit={submitHandler} className="flex flex-col gap-3">
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              name="about"
              placeholder="About"
              value={formData.about}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              required
              className="text-sm"
            />

            <button
              type="submit"
              className="bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Create Product
            </button>
          </form>
        </div>
      )}

      {/* Products section */}
      {loading ? (
        // Loading spinner
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        // Empty products state
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl mb-2">No products found</p>

          <button
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
            className="text-sm underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product image */}
                <div
                  className="h-40 bg-gray-50 flex items-center justify-center p-3 cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="p-3">
                  {/* Product title */}
                  <p
                    className="font-semibold text-sm text-gray-900 truncate cursor-pointer hover:underline"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.title}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
                    {product.about.slice(0, 40)}
                  </p>

                  <p className="font-bold text-gray-900 mt-1">
                    ₹ {product.price.toLocaleString()}
                  </p>

                  {/* Product stock */}
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        product.stock === 0
                          ? "bg-red-100 text-red-600"
                          : product.stock < 5
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      Stock: {product.stock}
                    </span>

                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Stock update form */}
                  {stockModal === product._id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="number"
                        placeholder="New stock"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-gray-500"
                      />

                      <button
                        onClick={() => updateStock(product._id)}
                        className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                      >
                        ✓
                      </button>

                      <button
                        onClick={() => {
                          setStockModal(null);
                          setNewStock("");
                        }}
                        className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setStockModal(product._id);
                        setNewStock("");
                      }}
                      className="mt-3 w-full border border-gray-300 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Update Stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {page > 1 && (
              <button
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
              >
                Next →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;