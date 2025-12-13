import { useState } from "react";
import {useDispatch} from "react-redux";
import { fetchProducts } from "../features/productsSlice";

function SearchBar(){
    const dispatch = useDispatch();
    const [query , setQuery] = useState("");

    function handleSearch(e){
        e.preventDefault();
        dispatch(fetchProducts({ search: query }));
    };

    return(
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="search"
            value={query}
            onChange={(e)=> setQuery(e.target.value)}
            />
            <button type="submit"> search </button>
        </form>
    );
}

export default SearchBar;