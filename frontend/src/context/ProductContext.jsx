import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import axios from "axios";
import { server } from "../main";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);

  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [categories, setCategories] = useState([]);

  const debounceRef = useRef(null);

  // Fetch all products
  async function fetchProducts() {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${server}/api/product/all?search=${search}&category=${category}&sortByPrice=${price}&page=${page}`,
      );

      setProducts(data.products);
      setNewProd(data.newProduct);
      setCategories(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);

  // Fetch single product
  async function fetchProduct(id) {
    setProductLoading(true);

    try {
      const { data } = await axios.get(`${server}/api/product/${id}`);

      setProduct(data.product);
      setRelatedProduct(data.relatedProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setProductLoading(false);
    }
  }

  // Debounced product fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [search, category, page, price]);

  return (
    <ProductContext.Provider
      value={{
        products,
        newProd,
        loading,
        productLoading,

        page,
        setPage,
        totalPages,

        search,
        setSearch,

        category,
        setCategory,

        price,
        setPrice,

        categories,

        fetchProducts,

        product,
        relatedProduct,
        fetchProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const ProductData = () => useContext(ProductContext);