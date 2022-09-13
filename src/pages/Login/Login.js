import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post('https://sec-ques-gw-aih99lng.ue.gateway.dev/login',{
      "email": email,
      "password": password
    }).then((response)=>{
      console.log(JSON.stringify(response.data))
      localStorage.setItem('userId',response.data['userId'])
      localStorage.setItem('email',email)

      const activity_data = {
        eventType: "User Login",
        eventTimestamp: new Date(),
        userEmail: localStorage.getItem('email'),
      };
  
      // The below "generateAccessReportCSV" api is developed by Fenil Shah
      const logActivity = axios.post(
        "https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/generateAccessReportCSV",
        activity_data
      );
      console.log("Event logged successfully: ", logActivity);

      navigate('/securityQuestion')
    })
  }

  return (
      <>
        <Header />
        <div className='container'>
    <div className='form-content'>
      <form className='form' noValidate onSubmit={onSubmit}>
        <h1>
          Login
        </h1>
        <div className='form-inputs-fields'>
          <label className='form-label'>Email</label>
          <input
            className='form-input'
            type='text'
            name='email'
            placeholder='Enter your email'
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>
        <div className='form-inputs-fields'>
          <label className='form-label'>Password</label>
          <input
              className='form-input'
              type='password'
              name='password'
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value.trim())}
          />
        </div>
        <button className='form-input-button' style={{marginTop: '30px'}} type='submit'>
          Log in
        </button>
        <button className='form-input-button' type='reset' onClick={() => navigate('/sign-up')}>
          Sign Up
        </button>
      </form>
    </div>
        </div>
      </>
  );
};

export default Login;
