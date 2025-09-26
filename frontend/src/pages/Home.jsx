import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productsSlice";
import { Link } from "react-router-dom";
import ProductFilters from "../components/ProductFilters";
import SearchBar from "../components/SearchBar";

function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "loading") return <div> Loading ...</div>;
  if (!items.length) return <p>No products found</p>;

  return (
    <div>
      <h1>Products</h1>
      <SearchBar/>
      <ProductFilters/>
      <ul>
        {items.map((item) => {
          return (
            <li key={item.id}>
              <Link to={`/products/${item.slug}`}>
                {item.name} - {item.price} 
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Home;