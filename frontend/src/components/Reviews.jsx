import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, createReview } from "../features/reviewSlice";

function Reviews({ productId }) {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.reviews);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchReviews([productId]));
  }, [dispatch, productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createReview({
        productId,
        review: { rating, comment },
      })
    );
    setRating(5);
    setComment("");
  };

  return (
    <div>
      <h3>Reviews</h3>
      {status === "loading" ? (
        <p>Loading..</p>
      ) : items.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        <ul>
          {items.map((review) => (
            <li key={review.id}>⭐{review.rating}/5 - [review.comment]</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <h4>Leave a review</h4>
        <select value= {rating} onChange={(e)=>setRating(Number(e.target.value))}>
        {[1,2,3,4,5].map((num)=>(
            <option key = {num} value={num}>
                {num}
            </option>
        ))}
        </select>
        <textarea placeholder="Write your review" value={comment} onChange={(e)=>setComment(e.target.value)}/>
        <button type="submit"> Submit review</button>
      </form>
    </div>
  );
}

export default Reviews;