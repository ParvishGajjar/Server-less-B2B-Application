import React, {useState} from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';


import './CSS/Card.css';

function Card({item_name,item_amount,item_url,orderList, setToogle,toogle}) {

  const [count,setCount] = useState(0);
  
  const handleClick = (item_name) => {
    setCount(count+1);
    setToogle(!toogle);
    orderList[item_name] = (count+1)*item_amount;
  }
  const handleNegative = (item_name) => {
    setCount(count-1);
    setToogle(!toogle);
    orderList[item_name] =(count-1)*item_amount;
    if(count-1===0){
      delete orderList[item_name];
    }
  }
  const handlePositive = (item_name) => {
    setCount(count+1);
    setToogle(!toogle);
    orderList[item_name] = (count+1)*item_amount;
  }



  return (
    <Grid container direction="column" border={2}
    alignItems="center"
    sx={{borderRadius: 5}}
    >
        <Grid item>
            <img src={item_url} alt="Food Image" className="imageFormat" />
        </Grid>
        <Grid container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        >
          <Grid item>
            <h2>{item_name}</h2>
            <h2>${item_amount}</h2>
            <h3>Count: {count}</h3>
          </Grid>
          <Grid item >
            {
              count===0? <Button variant="contained" onClick={() => handleClick(item_name)}>Select</Button>
              :
                <>
                <Button variant="contained" onClick={() => handleNegative(item_name)}>-</Button>
                <Button variant="contained" onClick={() => handlePositive(item_name)}>+</Button>
                </>
              
            }
            
          </Grid>
           
            
           
        </Grid>
    </Grid>
  )
}

export default Card