import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useStateValue } from "../StateProvider";
import CheckoutProduct from "../Checkout/CheckoutProduct";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card } from "@material-ui/core";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "../reducer";
import axios from "axios";

function Payment() {
  const history = useHistory();
  const [{ basket, user }, dispact] = useStateValue();
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await axios.post(`/payments/create?total=${getBasketTotal(basket) * 100}`);
      setClientSecret(response.data.clientSecret);
    }

    getClientSecret();
  }, [basket])

  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);


    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method:{
        card: elements.getElement(CardElement)
      }
    }).then(({paymentIntent}) => {
      setSucceeded(true);
      setError(false);
      setProcessing(false);

      history.replace('/orders');
    })
  };
  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };
  return (
    <div className='payment'>
      <div className='payment_container'>
        <h1>
          Checkout (<Link to='/checkout'>{basket?.length} items</Link>)
        </h1>
        <div className='payment_section'>
          <div className='payment_title'>
            <h3>Delivery Address</h3>
          </div>
          <div className='payment_address'>
            <p>{user?.name}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>
        <div className='payment_section'>
          <div className='payment_title'>
            <h3>Review items and delivery</h3>
          </div>
          <div className='payment_items'>
            {basket.map((item, i) => (
              <CheckoutProduct
                key={i}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        <div className='payment_section'></div>
        <div className='payment_title'>
          <h3>Payment Method</h3>
        </div>
        <div className='payment_details'>
          <form onSubmit={handleSubmit}>
            <CardElement onChange={handleChange} />

            <div className='payment_priceContainer'>
              <CurrencyFormat
                renderText={(value) => (
                  <>
                    <h3>Order total: {value}</h3>
                  </>
                )}
                decimalScale={2}
                value={getBasketTotal(basket)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
              <button disabled={processing || disabled || succeeded}>
                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
              </button>
            </div>
                {error && <div>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
