import React from "react";
import { useStateValue } from "../StateProvider";
import "./Product.css";

function Product({ id, title, price, image, rating }) {
  const [{ basket }, dispatch] = useStateValue();
  const addToCart = () => {
    //Dispatch an the item to the state
    dispatch({
      type: "ADD_TO_CART",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
      },
    });
    console.log(basket);
  };

  return (
    <div className='product'>
      <div className='product_info'>
        <p>{title}</p>
        <p className='product_price'>
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className='product_rating'>
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p>⭐</p>
            ))}
        </div>
      </div>
      <img src={image} alt='' />

      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default Product;
