import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useStateValue } from "../StateProvider";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [{}, dispatch] = useStateValue();

  const signIn = async (e) => {
    let token;
    e.preventDefault();
    await axios
      .post("http://localhost:8080/api/auth/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        token = res.data.jwt;
        let userName = res.data.user.email.split("@")[0];
        let user = {
          id: res.data.user.id,
          email: res.data.user.email,
          name: userName,
        };
        dispatch({
          type: "SET_USER",
          user: user,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
    console.log(token);
    localStorage.setItem("jwt", token);
    history.push("/");
  };

  const register = (e) => {
    e.preventDefault();
    history.push("/register");
  };

  return (
    <div className='login'>
      <Link to='/'>
        <img
          className='login_logo'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png'
        />
      </Link>

      <div className='login_container'>
        <h1>Sign in</h1>
        <form>
          <h5>E-mail</h5>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className='login_signinButton' onClick={signIn} type='submit'>
            Sign In
          </button>

          <p>
            By signing in you agree to the websites Condition of Use and Sale.
            Please read our Privacy Notice, our Cookies Notice, and out
            Interest-Based Ads Notice
          </p>
        </form>
        <button className='login_registerButton' onClick={register}>
          Create New Account
        </button>
      </div>
    </div>
  );
}

export default Login;
