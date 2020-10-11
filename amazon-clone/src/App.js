import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Header from "./Header/Header";
import Home from "./Home/Home";
import Checkout from "./Checkout/Checkout";
import Login from "./Login/Login";
import Payment from "./Payment/Payment";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const promise = loadStripe(
  "pk_test_51Ha5v4EgoW3DiPXwZObE3jjtZ1R2y7XnVbMElz1jRpk7dc2F8XLfvSab79jESRvNyggwRzHo1eDaMndwwHxQm4ne002Dg4XJc6"
);

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log(token);
    axios
      .get("http://localhost:8080/api/auth/", {
        headers: { authorization: `Bearer ${localStorage.getItem("jwt")}` },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          let userName = res.data.user.email.split("@")[0];
          console.log(userName);
          let user = {
            id: res.data.user.id,
            email: res.data.user.email,
            name: userName,
          };
          dispatch({
            type: "SET_USER",
            user: user,
          });
        } else {
          dispatch({
            type: "SET_USER",
            user: null,
          });
        }
      });
  }, [dispatch.user]);

  return (
    <Router>
      <div className='app'>
        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/checkout'>
            <Header />
            <Checkout />
          </Route>
          <Route path='/payment'>
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path='/' exact>
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
