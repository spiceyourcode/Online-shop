import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from  "react-router-dom";
import { fetchProduct } from "../features/productsSlice";

function ProductDetail(){
    const {slug} = useParams();
    const dispatch = useDispatch();
    const {selected} = useSelector((state)=> state.products);

    useEffect(()=>{
        dispatch(fetchProduct(slug));
    }, [dispatch, slug]);

    if(!selected) return <p>Loading..</p>

    return(
        <div>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <p>Price: ${selected.price}</p>
        </div>
    );
}

export default ProductDetail;
