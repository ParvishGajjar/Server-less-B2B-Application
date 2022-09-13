import React, {useState,useEffect,useCallback} from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import CardList from '../../components/CardList/CardList';
import Button from '@mui/material/Button';


let orderList = {};

function FoodOrder() {

    const [items,setItems] = useState([]);
    
    const [orderLs,setOrderLs] = useState();
    const [toogle,setToogle] = useState(true);
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);


    useEffect(() => {

        axios.get('https://kitchen-service-qjricmdu5q-uc.a.run.app/api/v1/getInventory').then((data) => {
            setItems(data.data.items);
        })

    },[])

    useEffect(() => {
        setOrderLs(orderList);
    },[toogle])

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        })
    })

    const handleNext = async () => {
        
        if( "email" in localStorage){
            localStorage.setItem("KitchenOrder", JSON.stringify(orderLs));
            const email = localStorage.getItem("email");
            let data = {
                email: email,
                items: orderLs
            };
            if(Object.keys(orderLs).length>0){

                const activity_data = {
                    eventType: "Order Food",
                    eventTimestamp: new Date(),
                    userEmail: localStorage.getItem('email'),
                };
            
                // The below "generateAccessReportCSV" api is developed by Fenil Shah
                const logActivity = await axios.post(
                    "https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/generateAccessReportCSV",
                    activity_data
                );
                console.log("Event logged successfully: ", logActivity);

                await axios.post('https://kitchen-service-qjricmdu5q-uc.a.run.app/api/v1/putOrder',data).then((res) => {
                    window.alert("Your Order is successfully placed");
                    navigate("/Invoice");
                }).catch((err) => {
                    console.log(err);
                })
            }else{
                window.alert("No Item Selected! Please select an Item");
            }
        }else{
            window.alert("You need to login to make in order");
            navigate("/login");
        }
        
        
        
    }


  return (
    <div>
        <Header />
        <Grid container 
        alignItems="center"
        justifyContent="center"
        sx={{mt:20}}
        >
            <h1>Order Food</h1>
        </Grid>
        
        <Grid container direction="row" sx={{mt:10, mx:10}}>
            {
                items !== undefined?<Grid item >
                <CardList items={items} orderList={orderList} setToogle={setToogle} toogle={toogle} />
            </Grid>
            :
            <>
            </>

            }
        </Grid>
        <Grid container direction="row"
        alignItems="cente"
        justifyContent="center"
        sx={{mt: 10}}>

            {
                loading 
            }
            <Button variant="contained" onClick={() => handleNext()} >Next</Button>

        </Grid>
    </div>
  )
}

export default FoodOrder