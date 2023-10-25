import React, { useState, useEffect } from "react";
import './App.css';
import { Link } from 'react-router-dom';
import Axios from "axios";

function App() {
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const [message, setMessage] = useState("")
  const [loginStatus, setLoginStatus] = useState(false)


  // function to the check user info button
  const userAuthenticated = () => {
    Axios.post("http://localhost:5000/api/isAuthenticated", null, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const login = () => {
    Axios.post("http://localhost:5000/api/signup", {
      email: email,
      password: password
    }).then((response) => {
      //console.log(response)
      alert("Success")

      if (!response.data.auth) {
        setMessage(response.data.message)
        setLoginStatus(false);
      }
      else {
        //setMessage(response.data[0].firstName) 
        setMessage(response.data.result[0].firstName); 
        setLoginStatus(true);
        localStorage.setItem("token", response.data.token)
      }
    })};
    
    Axios.defaults.withCredentials = true ;  // this needs when using sessions and cookies idk why ?
    useEffect(() => {
      Axios.get("http://localhost:5000/api/signup").then((response)=> {
        if (response.data.loggedIn == true) {
          //console.log(response);
          setMessage(response.data.user[0].firstName);
        }
      })
    }, [])

  return (
    <div className="App">
      <div className='app-main'>
        <span className="signin-main-title">Sign In</span>
        <input type="text" placeholder='email' onChange={(e)=> {
          setEmail(e.target.value);
        } }/>
        <input type="password" placeholder='Password' onChange={(e)=> {
          setpassword(e.target.value);
        }}/>
        <Link to="/signup"><button className='createaccount'>Create Account</button></Link>
        <button className='login' onClick={login}>Sign In</button>
        <h5>{message}</h5>
        {loginStatus && (
          <button onClick={userAuthenticated}>Check user info !</button>
        )}
      </div>
    </div>
  );
}

export default App;
