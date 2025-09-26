import { useState } from "react";
import {useDispatch} from "react-redux";
import { fetchProduct } from "../features/productsSlice";

function SearchBar(){
    const dispatch = useDispatch();
    const [query , setQuury] = useState("");

    function handleSearch(e){
        e.preventDefault();
        dispatch(fetchProduct({search:query}));
    };

    return(
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="search"
                value={query}
                onChange={(e)=> setQuury(e.target.value)}
            />
            <button type="submit"> search </button>
        </form>
    );
}

export default SearchBar;