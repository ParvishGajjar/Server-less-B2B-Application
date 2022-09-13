import React, { useEffect, useState } from 'react';
import './SecurityQuestion.css';
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import axios from 'axios';

const SecurityQuestion = () => {
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')

  const navigate = useNavigate();

  useEffect(()=>{
    axios.get('https://sec-ques-gw-aih99lng.ue.gateway.dev/security-questions?userId='+localStorage.getItem('userId'))
    .then((response)=>{
      setSecurityQuestion(response.data['question'])
    })
  },[])

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('https://sec-ques-gw-aih99lng.ue.gateway.dev/security-questions?userId='+localStorage.getItem('userId'),{
      "question": securityQuestion,
      "answer": securityAnswer
    })
    .then((response)=>{
      console.log(response.data)
      navigate('/caesarCipher')
    })
  }

  return (
      <>
        <Header />
        <div className='container'>
    <div className='form-content'>
      <form className='form' noValidate onSubmit={onSubmit}>
        <h1>
          Security Check
        </h1>
        <div className='form-inputs-fields'>
          <label className='form-label'>Your Security Question</label>
          <input
            className='form-input'
            type='text'
            name='securityQuestion'
            placeholder='Security Question' // add security question here
            value={securityQuestion}
            readOnly
          />
        </div>
        <div className='form-inputs-fields'>
          <label className='form-label'>Security Answer</label>
          <input
              className='form-input'
              type='text'
              name='securityAnswer'
              placeholder='Enter your Security Answer'
              onChange={(e) => setSecurityAnswer(e.target.value.trim())}
          />
        </div>
        <button className='form-input-button' style={{marginTop: '30px'}} type='submit'>
          Submit
        </button>
      </form>
    </div>
        </div>
      </>
  );
};

export default SecurityQuestion;
