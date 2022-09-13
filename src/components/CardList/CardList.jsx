import React from 'react'
import Grid from '@mui/material/Grid';
import Card from '../Card/Card';

function CardList({items,orderList,setOrderLs,setToogle,toogle}) {
  return (
    <Grid container direction="row"  spacing={10}>
            {items.map((item) => (
                <Grid item>
                    <Card item_name={item.item_name} item_amount={item.item_amount} item_url={item.item_url} orderList={orderList} setToogle={setToogle} toogle={toogle} />
                </Grid>
                
            ))}
    </Grid>
  )
}

export default CardList