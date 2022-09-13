// Authored by: Parvish Vijay Gajjar (B00912090)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import moment from 'moment';
import { ToastContainer, toast } from "react-toastify";
// import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import Box from '@mui/material/Box';

function Feedback() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [emailError, setEmailError] = useState("");
    const [feedbackError, setFeedbackError] = useState("");
    const [sentiment, setSentiment] = useState(null);

    useEffect(() => {
        //  Check if user is logged in and redirect to home page if not logged in
        console.log("Welcome to Feedback")
        async function getSentiment() {
            const result = await axios.get("https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/getSentiment")
            console.log(result.data)
            if (result.data.message === "success") {
                return result.data
            } else {
                return null;
            }
        }
        if (localStorage.getItem("email") === "admin@gmail.com") {
            try {
                getSentiment().then(result => {
                    console.log(result);
                    if (result.data.length) {
                        let temp = result.data.split(" ")[2].substr(0, 4);
                        temp = parseFloat(temp);
                        console.log("Score", temp);
                        setSentiment(temp)
                    } else {
                        setSentiment(null);
                    }
                })

            } catch (e) {
                console.error(e.message)
            }

        }
    }, [sentiment])

    const handleSubmit = async () => {
        checkEmailError()
        checkFeedbackError()
        if (!(emailError.length || feedbackError.length)) {
            console.log("Email: " + email)
            console.log("Feedback: " + feedback)
            console.log("createdAt: " + moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
            const data = {
                userId: email,
                feedback: feedback,
                createdAt: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
            try {
                const result = await axios.post('https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/addFeedback', data)
                if (result.data.status) {
                    console.log(result.data)
                    toast.success("Your feedback was successfully submitted, Thank you!", {
                        position: "top-right",
                        theme: "dark",
                        autoClose: 300,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                } else {
                    console.log(result)
                    toast.error("Something went wrong!", {
                        position: "top-right",
                        theme: "dark",
                        autoClose: 300,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } catch (e) {
                console.log("Error: " + e.message);
            }

        } else {
            console.log("Email Error: " + emailError)
            console.log("Feedback Error: " + feedbackError)
        }
    }

    const validateEmail = (email) => {
        if (!email) {
            return "Email is required"
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
            return "Email address is invalid";
        }
        else {
            return "";
        }
    }

    const checkEmailError = () => {
        let temp = emailError
        if (validateEmail(email).length) {
            temp = validateEmail(email)
            setEmailError(temp)
        } else {
            temp = ""
            setEmailError(temp)
        }
    }

    const checkFeedbackError = () => {
        let temp = feedbackError
        if (feedback.length === 0) {
            temp = "Please enter a feedback"
            setFeedbackError(temp)
        } else {
            temp = ""
            setFeedbackError(temp)
        }
    }

    return (
        <div>
            <Header />
            {localStorage.getItem("email") === "admin@gmail.com" ?
                <div>
                    <Grid container
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 20 }}
                    >
                        <h1>Feedback Sentiment Analysis for the Application</h1>
                    </Grid>
                    <Grid container alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 5 }} >
                        {sentiment === null ? "Loading..." :
                            sentiment > 0 ? `Sentiment for the Application is positive with score of ${sentiment}` :
                                sentiment == 0 ? `Sentiment for the Application is neutral with score of ${sentiment}` :
                                    `Sentiment for the Application is negative with score of ${sentiment}`}
                    </Grid>
                </div>
                :
                <div>
                    {/* <Header /> */}
                    <Grid container
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 20 }}
                    >
                        <h1>Feedback</h1>
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
                                        Email:
                                    </Typography>
                                </td>
                                <td>
                                    <TextField
                                        label="Enter your email address"
                                        variant="outlined"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value)
                                            checkEmailError();
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <Typography color="red">
                                        {<p>{emailError}</p>}
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
                                    Feedback
                                </Typography></td>
                                <td>

                                    <TextField
                                        label="Feedback"
                                        multiline
                                        fullWidth
                                        value={feedback}
                                        rows={4}
                                        placeholder="Add feedback..."
                                        onChange={(event) => {
                                            setFeedback(event.target.value);
                                            checkFeedbackError();
                                        }}
                                    />

                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <Typography color="red">
                                        <p>{feedbackError}</p>
                                    </Typography>
                                </td>
                            </tr>

                        </table>

                    </Grid>

                    <Grid container direction="row"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 10 }}>
                        <Button variant="contained" onClick={() => handleSubmit()} >Submit</Button>
                    </Grid>
                </div>}
            <ToastContainer />
        </div>
    )

}

export default Feedback;
