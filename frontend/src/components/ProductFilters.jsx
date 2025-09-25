import {useState} from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../features/productsSlice";

export default function ProductFilters(){
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [category, setCategory] =useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] =useState("");

    const handleSearch = (e) =>{
        e.preventDefault();
        dispatch(fetchProducts({
            search:query,
            category,
            min_price: minPrice,
            max_price :maxPrice
        }))
    };

    return(
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search products.."
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
            
            />
            <select value={category} onChange={(e)=> setCategory(e.target.value)}>
                <option value="">Select option</option>
                <option value="Phones">Phones</option>
                <option value="laptops">Laptops</option>
                <option value="accessories">Accesories</option>
            </select>
            <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e)=>setMinPrice(e.target.value)}
            />
            <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e)=>setMaxPrice(e.target.value)}
            />
            <button type="submit">Filter</button>
            
        </form>
    );

}