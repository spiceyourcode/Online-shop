import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productsSlice";
import { Link } from "react-router-dom";
import ProductFilters from "../components/ProductFilters";
import SearchBar from "../components/SearchBar";

function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  // Load products initially
  useEffect(() => {
    dispatch(fetchProducts({})); // empty filters -> all products
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline" >Products</h1>

      {/* Search + Filters */}
      <SearchBar />
      <ProductFilters />

      {/* Status Handling */}
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error loading products.</p>}
      {status === "succeeded" && items.length === 0 && <p>No products found.</p>}

      {/* Product List */}
      {status === "succeeded" && items.length > 0 && (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/products/${item.slug}`}>
                {item.name} - {item.price}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
