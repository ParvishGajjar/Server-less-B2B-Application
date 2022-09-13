import React, {useEffect,useState} from 'react'
import axios from 'axios';
import Header from '../../components/Header/Header';
import Grid from '@mui/material/Grid';
import { borderLeft } from '@mui/system';

function Invoice() {

  const [orderItems,setOrderItems] = useState([]);
  const [orderId,setOrderId] = useState('');
  const [orderDate,setOrderDate] = useState('');
  const [roomOrder,setRoomOrder] = useState([]);
  const [kitchenOrder,setKitchenOrder] = useState([]);
  const [total,setTotal] = useState(0);

  useEffect(() =>{

    if( "email" in localStorage){
      const email = localStorage.getItem("email");
      axios.get(`https://invoice-service-qjricmdu5q-nn.a.run.app/api/v1/kitchenorders/${email}`).then((response) =>
      {

        setOrderItems(response.data.result[0].order_items);
        setOrderId(response.data.result[0].order_id);
        setOrderDate(response.data.result[0].order_dt);
        setRoomOrder(response.data.roomOrder);
        setKitchenOrder(response.data.result);

        let temp = response.data.result[0].order_items;
        let sum = 0;
        Object.keys(temp).map((key, index) => {
          sum+=temp[key];
        });
        setTotal((Math.round(sum*100))/100);
    })
    }
    
  },[]);



  return (
    <div>
      <Header />
      
      <Grid container
      alignItems="center"
      justifyContent="center"
      sx={{mt:20, mb: 20}}
      direction="column"
      borderRadius={5}
      border={1}
      >
          <h1 style={{textAlign: 'center'}}>Order Invoices</h1>
          <h4 style={{marginTop: '20px'}}>Kitchen Orders</h4>
          <Grid item sx={{mt: 3}} >
              
              {/* {
                orderItems !== undefined ?
                Object.entries(orderItems).map(([key,value]) => <Grid container border={2} justifyContent="center">{key} : ${value}</Grid>)
                : <></>
              } */}
              {
                kitchenOrder !== undefined ?
                Object.entries(kitchenOrder).map(([key,value]) => 
                <Grid container justifyContent="center" alignItems="center"
                direction="column" borderTop={2}  sx={{mt:3,borderRadius: 5, borderColor: 'primary.main', backgroundColor: '#D6E6F2'}}>
                  <Grid container alignItems="center" justifyContent="center" ><h4>Order {parseInt(key)+1}</h4></Grid>
                  <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Order Id: {value.order_id}</Grid>
                  <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Order Date: {value.order_dt}</Grid>
                  <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Order Items</Grid>
                  {
                    Object.entries(value.order_items).map(([ky,val]) => 
                      <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main', backgroundColor: '#D6E6F2'}}>{ky} : {val}</Grid>
                    )
                  }
                </Grid>

                ):<></>
              }
              {/* <Grid border={2} container justifyContent="center">Total:  ${total}</Grid> */}
              
          </Grid> 
          <h4 style={{marginTop: '30px'}}>Your Order Summary for the rooms booked</h4>
          <Grid item sx={{mt: 3}} >
            {
              roomOrder !== undefined?
              Object.entries(roomOrder).map(([key,value]) => 
              <Grid container justifyContent="center" alignItems="center" direction="column" sx={{mt:3,borderRadius: 5, borderColor: 'primary.main', backgroundColor: '#D6E6F2'}}>
                <Grid container alignItems="center" justifyContent="center"  borderTop={2} sx={{borderColor: 'primary.main', borderRadius: 5}} ><h4>Order {parseInt(key)+1}</h4></Grid>
                <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Room Number: {value.RoomNumber}</Grid>
                <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Room Type: {value.RoomType}</Grid>
                <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Checkin Date: {value.CheckinDate}</Grid>
                <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Checkout Date: {value.CheckoutDate}</Grid>
                <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Booking Date: {value.BookingDate}</Grid>
                <Grid container alignItems="center" justifyContent="center"  border={2} sx={{borderColor: 'primary.main'}}>Total Cost: {value.Cost}</Grid>
              </Grid>
              ) : <></>
            }
          </Grid>

      </Grid>
    </div>
  )
}

export default Invoice;