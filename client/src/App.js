import React, { useState, useEffect } from "react";
import './App.css';
import { Link } from 'react-router-dom';
import Axios from "axios";

function App() {
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const [message, setMessage] = useState("")

  const login = () => {
    Axios.post("http://localhost:5000/api/signup", {
      email: email,
      password: password
    }).then((response) => {
      console.log(response)
      alert("Success")

      if (response.data.message) {
        setMessage(response.data.message)
      }
      else {
        setMessage(response.data[0].firstName)
      }
    })};
    
    Axios.defaults.withCredentials = true ;  // this needs when using sessions and cookies idk why ?
    useEffect(() => {
      Axios.get("http://localhost:5000/api/signup").then((response)=> {
        if (response.data.loggedIn == true) {
          console.log(response);
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
      </div>
    </div>
  );
}

export default App;
