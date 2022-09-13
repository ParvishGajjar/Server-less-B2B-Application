import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import AvailableRooms from "./AvailableRooms";
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment';
// import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import Box from '@mui/material/Box';

function Hotel() {

    const navigate = useNavigate();
    // The "getAvailableRoomsApi" is developed by Fenil Shah
    const getAvailableRoomsApi =
    "https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/GetAvailableHotelRooms";

    const [dateRange, setDateRange] = React.useState([null, null]);
    const [roomType, setRoomType] = useState("");
    const [error, setError] = useState({ startDateError: "", endDateError: "", roomTypeError: "" });
const [click, setClick] = useState(false);
const [availableRooms, setAvailableRooms] = useState({
    success: false,
    items: [],
  });
    useEffect(() => {
        //  Check if user is logged in and redirect to home page if not logged in
        console.log("Welcome to Hotel")
    }, [])

    const handleNext = async () => {
        console.log("next")
        if(checkErrors()){
            const activity_data = {
                eventType: "Check Room Availability",
                eventTimestamp: new Date(),
                userEmail: localStorage.getItem('email'),
              };
          
              // The below "generateAccessReportCSV" api is developed by Fenil Shah
              const logActivity = await axios.post(
                "https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/generateAccessReportCSV",
                activity_data
              );
              console.log("Event logged successfully: ", logActivity);

            // The following axios api call is developed by Fenil Shah
            await axios
              .get(getAvailableRoomsApi, {
                params: {
                  room_type: roomType,
                },
              })
              .then((response) => {
                console.log("Response received in Frontend: ", response);
                if (response.data.success) {
                  //   console.log("response.data.success", response.data.success);
                  setAvailableRooms({
                    success: response.data.success,
                    items: JSON.parse(response.data.available_rooms),
                  });
                } else if (!response.data.success) {
                  // navigate("/login");
                  console.log("Failed to search for the available rooms");
                }
              })
              .catch((err) => {
                console.log("Error:", err);
              });
            setClick(true);
        } else {
            setClick(false);
            checkErrors()
        }
    }

    const checkErrors= ()=>{
        checkErrorStartDate()
        checkErrorEndDate()
        checkErrorRoomType()
        console.log(error)
        if(error.startDateError.length || error.endDateError.length || error.roomTypeError.length){
            return false;
        } else {
            return true;
        }
    }

    useEffect(()=>{
        if(error.startDateError.length || error.endDateError.length || error.roomTypeError.length){
            console.log("Effect",error)
        }
    }, [error])

    const checkErrorStartDate=()=>{
        let temp=error
        if(dateRange[0]===null){
            console.log("Here", dateRange[0])
            temp.startDateError="Please select a start date."
            setError(temp)
        } else {
            error.startDateError=""
            setError(temp)
        }
    }

    const checkErrorEndDate=()=>{
        let temp=error
        console.log(dateRange)
        if(dateRange[1]===null){
            console.log("Here2", dateRange[1])
            temp.endDateError="Please select a end date."
            setError(temp)
        } else {
            temp.endDateError="";
            setError(temp)
        }
    }
    const checkErrorRoomType = ()=>{
        let temp=error;
        if(roomType===""){
            temp.roomTypeError="Please select the type of room you want for your stay."
            setError(temp)
        } else {
            temp.roomTypeError=""
            setError(temp)
        }
    }

    return (
        <div>
            <Header />
            <Grid container
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 2 }}
            >
                <h1>Check Room Availibility</h1>
            </Grid>
            <Grid container alignItems="center"
                justifyContent="center"
                sx={{ mt: 5 }} >
                <table>
                    <tr>
                        <td>
                            <Typography
                                textAlign="center"
                                width="100%"
                            >
                                Duration of Stay:
                            </Typography>
                        </td>
                        <td>
                            <LocalizationProvider dateAdapter={AdapterDateFns} localeText={{ start: 'Check-in', end: 'Check-out' }}>
                                <DateRangePicker
                                    displayStaticWrapperAs="desktop"
                                    value={dateRange}
                                    onChange={(newValue) => {
                                        setDateRange(newValue);
                                    }}
                                    renderInput={(startProps, endProps) => (
                                        <React.Fragment>
                                            <TextField {...startProps} />
                                            <Box sx={{ mx: 2 }}> to </Box>
                                            <TextField {...endProps} />
                                        </React.Fragment>
                                    )}
                                    disablePast={true}
                                />
                            </LocalizationProvider>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <Typography color="red">
                                {error.startDateError.length
                                ? error.startDateError 
                                : error.endDateError.length
                                ? error.endDateError 
                                : <p></p>}
                            </Typography>
                        </td>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>

                    <tr>
                        <td><Typography
                            textAlign="center"
                            width="100%"
                        >
                            Room Type:
                        </Typography></td>
                        <td>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-standard-label">Room Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={roomType}
                                    label="Room Type"
                                    onChange={(e) => { 
                                        setRoomType(e.target.value);
                                    }}
                                >
                                    <MenuItem value={'Single'}>Single</MenuItem>
                                    <MenuItem value={'Double'}>Double</MenuItem>
                                    <MenuItem value={'Suite'}>Suite</MenuItem>
                                </Select>
                            </FormControl>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <Typography  color="red">
                                {error.roomTypeError.length
                                ? error.roomTypeError 
                                : <p></p>}
                            </Typography>
                        </td>
                    </tr>

                </table>

            </Grid>

            <Grid container direction="row"
                alignItems="center"
                justifyContent="center"
                >
                <Button variant="contained" onClick={() => handleNext()} >Check Availability</Button>
            </Grid>
            {click? <AvailableRooms availableRooms={availableRooms}
            setAvailableRooms={setAvailableRooms}
            roomType={roomType} 
            startDate={moment(dateRange[0]).format("YYYY-MM-DD")} 
            endDate={moment(dateRange[1]).format("YYYY-MM-DD")}/>:(<div></div>)}
        </div>
    )

}

export default Hotel
