// Author: Fenil Shah

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import axios from "axios";
import "./Rooms.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AvailableRooms(props) {
  const availableRooms = props.availableRooms;
  const navigate = useNavigate();

  const bookRoomApi = "https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/bookRoom";
  const toastStyle = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    transition: null,
  };

  const handleBookRoom = async (id) => {
    const activity_data = {
      eventType: "Book Room",
      eventTimestamp: new Date(),
      userEmail: localStorage.getItem('email'),
    };

    // The below "generateAccessReportCSV" api is developed by Fenil Shah
    const logActivity = await axios.post(
      "https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/generateAccessReportCSV",
      activity_data
    );
    console.log("Event logged successfully: ", logActivity);

    console.log("Booking Room Number: ", id);
    const booking_details = {
      documentId: id,
      userId: localStorage.getItem('email'),
      startDate: props.startDate,
      endDate: props.endDate,
    };

    // POST API - Cloud function to book room authored by Parvish Vijay Gajjar (B00912090)
    const bookRoom = await axios.post(
      bookRoomApi,
      booking_details
    );
    const tempItem=[]
    props.availableRooms.items.forEach(item=>{
      if(item.RoomId!==id){
        tempItem.push(item)
      }
    })
    props.setAvailableRooms({
      success: false,
      items: tempItem
    })
    console.log("Room Booking Successful:", bookRoom);
    toast.success("Your room was successfully booked, Thank you!", {
      position: "top-right",
      theme: "dark",
      autoClose: 300,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  };

  console.log("Available Rooms State is :", availableRooms);

  return (
    <div>
      <ToastContainer autoClose={10} hideProgressBar={false} newestOnTop={false} closeOnClick /> <ToastContainer />
      {availableRooms.items.length > 0 ? (
        <div>
          <Grid container alignItems="center" justifyContent="center">
            <h1 style={{ textAlign: "center", margin: "1%", color: "grey" }}>
              Available Rooms
            </h1>
          </Grid>

          <Grid container direction="row">
            {availableRooms.items.map((entry) => {
              return (
                <Grid
                  item
                  style={{ margin: "1% 2%", width: "20%" }}
                  key={entry.RoomId}
                >
                  <Card
                    className="room-container"
                    variant="outlined"
                    style={{ padding: "1%" }}
                  >
                    <CardContent style={{ padding: "1%", textAlign: "center" }}>
                      <h2 style={{ margin: "1%" }}>
                        Room Number: {entry.RoomNumber}
                      </h2>
                      <h3 className="room-type" style={{ margin: "1%" }}>
                        <i>Type: {entry.RoomType} Room</i>
                      </h3>
                      <h3 style={{ margin: "1%" }}>
                        Cost per day: ${entry.Cost}
                      </h3>
                    </CardContent>
                    <CardActions style={{ justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleBookRoom(entry.RoomId);
                        }}
                      >
                        Book Room
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </div>
      ) : (
        <div>
          <h2 style={{ textAlign: "center", margin: "5%", color: "red" }}>
            No Rooms Available
          </h2>
        </div>
      )}
    </div>
  );
}

export default AvailableRooms;
