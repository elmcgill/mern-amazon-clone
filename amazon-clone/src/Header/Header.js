import React, { useEffect, useState } from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import Axios from "axios";

function Header() {
  const [{ basket, user }, dispatch] = useStateValue();

  const handleAuth = async () => {
    if (user) {
      console.log(localStorage.getItem("jwt"));
      await Axios.get("http://localhost:8080/api/auth/logout", {
        headers: { authorization: `Bearer ${localStorage.getItem("jwt")}` },
      }).then((res) => {
        console.log("before the dispatch");
        dispatch({
          type: "SET_USER",
          user: null,
        });
        console.log("after the so called dispatch");
        localStorage.clear();
      });
      console.log(user);
    }
  };

  return (
    <div className='header'>
      <Link to='/'>
        <img
          className='header_logo'
          src='http://pngimg.com/uploads/amazon/amazon_PNG11.png'
        />
      </Link>

      <div className='header_search'>
        <input className='header_search_input' type='text'></input>
        <SearchIcon className='header_search_icon' />
      </div>

      <div className='header_nav'>
        {!user ? (
          <div className='header_option'>
            <Link to={"/login"}>
              <span className='header_option_one'>Hello Guest</span>
              <span className='header_option_two'>Sign In</span>
            </Link>
          </div>
        ) : (
          <div onClick={handleAuth} className='header_option signedIn'>
            <span className='header_option_one'>Hello {user.name}</span>
            <span className='header_option_two'>Sign Out</span>
          </div>
        )}
        <div className='header_option'>
          <span className='header_option_one'>Returns</span>
          <span className='header_option_two'>& Orders</span>
        </div>
        <div className='header_option'>
          <span className='header_option_one'>Your</span>
          <span className='header_option_two'>Prime</span>
        </div>
      </div>

      <Link to='/checkout'>
        <div className='header_basket'>
          <ShoppingCartIcon />
          <span className='header_option_two header_basket_count'>
            {basket?.length}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default Header;
