import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import Axios from "axios";



function Signup() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const submit = () => {
    Axios.post("http://localhost:5000/api/insert", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }).then((response) => {
      alert("Successfully signed up, try to log in using email and password!");
    }); // pushing data into the backend with relevant variables
  };
  

  return (
    <div className="signup-app">
      <div className="signup-main">
        <span className="signup-main-title">Sign Up</span>
        <input type="text" placeholder="First Name" onChange={(e)=>{
          setfirstName(e.target.value);
        }}/>
        <input type="text" placeholder="Last Name" onChange={(e)=>{
          setlastName(e.target.value);
        }}/>
        <input type="text" placeholder="Email" onChange={(e)=>{
          setemail(e.target.value);
        }}/>
        <input type="password" placeholder="Password" onChange={(e)=>{
          setpassword(e.target.value);
        }}/>
        <Link to="/">
          <button>Already have account ?</button>
        </Link>
        <button className="login" onClick={submit}>Sign Up</button>
      </div>
    </div>
  );
}

export default Signup;
