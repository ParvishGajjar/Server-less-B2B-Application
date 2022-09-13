import React, {useState} from 'react';
import './SignUp.css';
import { useNavigate} from "react-router-dom";
import Header from "../../components/Header/Header";
import { v4 as uuidv4 } from 'uuid';

const SignUpForm = () => {
  
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [key, setKey] = useState('')

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const userId = uuidv4();
    const axios = require('axios');
    const data = JSON.stringify({
      "userId": userId,
      "email": email,
      "name": name,
      "securityQuestion": securityQuestion,
      "securityAnswer": securityAnswer,
      "key": key,
      "isLoggedIn": "logout"
    });

    const config = {
      method: 'post',
      url: 'https://x7pwtniqnyv5hkhrj3sn3r2m7y0waonh.lambda-url.us-east-1.on.aws/',
      headers: {
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          const data2={
            "userId": userId,
            "email": email,
            "password": password,
            "question": securityQuestion,
            "answer": securityAnswer
          }
          axios.post('https://sec-ques-gw-aih99lng.ue.gateway.dev/register',data2).then((response)=>{
            console.log(JSON.stringify(response.data))
            navigate('/login')
          })
          .catch((error)=>{
            console.error(error)
          })
        })
        .catch(function (error) {
          console.log(error);
        });

  }

  return (
      <div>
      <Header  />
    <div className='container'>
 
    <div className='form-content'>
      <form className='form' noValidate onSubmit={onSubmit}>
        <h1>
          Sign Up
        </h1>
        <div className='form-inputs-fields'>
          <label className='form-label'>Name</label>
          <input
              className='form-input'
              type='text'
              name='name'
              placeholder='Enter your name'
              onChange={(e) => setName(e.target.value.trim())}
          />
        </div>
        <div className='form-inputs-fields'>
          <label className='form-label'>Email</label>
          <input
              className='form-input'
              type='text'
              name='email'
              placeholder='Enter your email address'
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
        <div className='form-inputs-fields'>
          <label className='form-label'>Security Question</label>
          <select
              className='form-input'
              id='text'
              name='securityQuestion'
              placeholder='Choose the Security Question'
              onChange={(e) => setSecurityQuestion(e.target.value.trim())}
          >
            <option value="What is your favourite sport?">What is your favourite sport?</option>
            <option value="What is your childhood school name?">What is your childhood school name?</option>
            <option value="What is you favourite movie name?">What is you favourite movie name?</option>
            <option value="What is your oldest sibling name?">What is your oldest sibling name?</option>
          </select>
        </div>
        <div className='form-inputs-fields'>
          <label className='form-label'>Security Answer</label>
          <input
              className='form-input'
              type='text'
              name='securityAnswer'
              placeholder='Enter your answer of Security Question'
              onChange={(e) => setSecurityAnswer(e.target.value.trim())}
          />
        </div>
        <div className='form-inputs-fields'>
          <label className='form-label'>Security Key</label>
          <input
              className='form-input'
              type='text'
              name='key'
              placeholder='Enter the key for security (between 1 to 25)'
              onChange={(e) => setKey(e.target.value.trim())}
          />
        </div>
        <button className='form-input-button' style={{marginTop: '30px'}} type='submit'>
          Sign up
        </button>
        <button className='form-input-button' type='submit' onClick={() => navigate('/login')}>
          Log in
        </button>
      </form>
    </div>
    </div>
      </div>
  );
};

export default SignUpForm;
