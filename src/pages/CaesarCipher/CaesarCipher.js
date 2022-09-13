import React, { useEffect, useState } from 'react';
import './CaesarCipher.css';
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import randomStringGenerator from "../../utilities/randomStringGenerator";
import axios from 'axios';

const CaesarCipher = () => {
  const [plainText, setPlainText] = useState('')
  const [encryptedText, setEncryptedText] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    setPlainText(randomStringGenerator())
  }, [])
  
  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('https://sec-ques-gw-aih99lng.ue.gateway.dev/ceaserCipher',{
      "text": plainText,
      "encryptedText": encryptedText,
      "email": localStorage.getItem('email')
    }) 
    .then((response)=>{
      console.log(response.data)
      navigate('/Hotel');
    })
  }

  return (
      <>
        <Header />
        <div className='container'>
    <div className='form-content'>
      <form className='form' noValidate onSubmit={onSubmit}>
        <h1>
          Please Decrypt the text
        </h1>
        <div className='form-inputs-fields'>
          <label className='form-label'>Your Plain text</label>
          <input
            className='form-input'
            type='text'
            name='plainTest'
            placeholder= {plainText} // add encrypted text here
            readOnly
          />
        </div>
        <div className='form-inputs-fields'>
          <label className='form-label'>Your Answer</label>
          <input
              className='form-input'
              type='text'
              name='encryptedText'
              placeholder='Encrypted Text'
              value={encryptedText}
              onChange={(e)=>setEncryptedText(e.target.value)}
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

export default CaesarCipher;
