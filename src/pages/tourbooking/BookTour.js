import Header from "../../components/Header/Header"
import { useState, useRef, useEffect } from "react";
import { Button, Col, Form, Row, Container, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { publishTourBookingMessage, viewAvailableTours } from "./BookTourApiCalls";
import axios from "axios";

const BookTour = () => {

    const scrollRef = useRef(null);
    const [tours, setTours] = useState([])
    const [tourBooked, setTourBooked] = useState(false)
    const [messageId, setMessageId] = useState("")

    const localStorageUserId = localStorage.getItem('userId')
    const localStorageEmail = localStorage.getItem('email')

    console.log('Local Storage User Id', localStorageUserId)
    console.log('Local Storage Email', localStorageEmail)




    useEffect(() => {
        // GET API - Cloud function to get tours authored by Parvish Vijay Gajjar (B00912090)
        viewAvailableTours().then((response) => {
            if (response.message === 'successs') {
                setTours(response.data)
            }
        });
    }, []);

    //Regex for validations
    const onlyNumbersRegex = /^[0-9]*$/
    const nameRegex = /^[a-zA-Z\s]*$/
    const dateExpiryRegex = /^\d{2}\/\d{2}\/\d{4}$/
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    //Main tourbooking form
    const [mainForm, setMainForm] = useState({
        userName: "",
        userId: null == localStorageUserId ? "1" : localStorageUserId,
        userEmail: "",
        additionalGuests: "",
        tourId: "",
        tourCost: "",
        tourDays: "",
        tourName: "",
        tourDate: "",
        customRequests: ""
    })

    //Form errors
    const [formErrors, setFormErrors] = useState({});
    const [validated, setValidated] = useState(false);

    //Common method to update form fields
    const updateFormFields = (formFieldName, formFieldValue) => {
        setMainForm({
            ...mainForm,
            [formFieldName]: formFieldValue,
        });
        setFormErrors({})
    }

    //Form validations
    const validateForm = () => {
        const errors = {};
        if (!onlyNumbersRegex.test(mainForm.additionalGuests)) {
            errors.additionalGuests = "Additional guests should consist of only digits";
        }
        if (!nameRegex.test(mainForm.userName)) {
            errors.userName = "Name should only consist of letters and spaces";
        }
        if (!nameRegex.test(mainForm.customRequests)) {
            errors.customRequests = "Custom requests should only consist of letters and spaces";
        }
        if (!dateExpiryRegex.test(mainForm.tourDate)) {
            errors.tourDate =
                "Tour date should only consist of digits in the format MM/dd/YYYY with appropriate month, date and year";
        }
        if (!emailRegex.test(mainForm.userEmail)) {
            errors.userEmail =
                "Enter a valid email id";
        }
        var validTourId = false;
        for (let i = 0; i < tours.length; i++) {
            let obj = tours[i];
            if (obj.tourId == mainForm.tourId) {
                validTourId = true
                mainForm.tourCost = obj.tourCost
                mainForm.tourDays = obj.tourDays
                mainForm.tourName = obj.tourName
            }
        }
        if (!validTourId) {
            errors.tourId = "Enter a valid tour number from the list displayed above"
        }

        return errors
    }

    //On submitting form
    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const currentErrors = validateForm();
        if (Object.keys(currentErrors).length > 0) {
            setFormErrors(currentErrors);
            setValidated(false);
            scrollRef.current.scrollIntoView();
        } else {
            console.log('Form validated successfully', mainForm);

            const activity_data = {
                eventType: "Book Tour",
                eventTimestamp: new Date(),
                userEmail: localStorage.getItem('email'),
              };
          
              // The below "generateAccessReportCSV" api is developed by Fenil Shah
              const logActivity = await axios.post(
                "https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/generateAccessReportCSV",
                activity_data
              );
              console.log("Event logged successfully: ", logActivity);

            await publishTourBookingMessage(mainForm).then((response) => {
                if (response.success) {
                    console.log('Response ', response)
                    setValidated(true);
                    setFormErrors([])
                    setMessageId(response.messageId)
                    setTourBooked(true)
                } else {
                    setValidated(false);
                    setFormErrors({
                        message: "Failed to book a tour. Please try again",
                    });
                    scrollRef.current.scrollIntoView();
                }
            });
        }
    };

    return (
        <div>
            <div>
                <Header />
            </div>
            {null != localStorageEmail &&
                <Container>
                    {tourBooked ? <div className="py-3 text-center">
                        <Row>
                            <h3>Congratulations! You have successfully booked a tour</h3>
                            <h3>Your bookingid is {messageId}</h3>
                        </Row>
                    </div> :
                        <div>
                            <Row>
                                <div className="py-3 text-center">
                                    <h3>Available tours</h3>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Tour Name</th>
                                                <th>Tour Cost</th>
                                                <th>Tour Days</th>
                                                <th>Tour Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                tours.map((tour) => (
                                                    <tr key={tour.tourId}>
                                                        <td>{tour.tourId}</td>
                                                        <td>{tour.tourName}</td>
                                                        <td>{tour.tourCost}</td>
                                                        <td>{tour.tourDays}</td>
                                                        <td>{tour.tourDescription}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Row>
                            <Row>
                                <div className="py-3 text-center">
                                    <div ref={scrollRef}>
                                        <Form onSubmit={handleSubmit} validated={validated}>
                                            <h4 className="mb-3" style={{ paddingTop: 50 }}>Tour Form</h4>
                                            <div className="d-block my-3">
                                                <Row>
                                                    <Form.Group as={Col} md="6" className="mb-3">
                                                        <Form.Label>Which tour number would you like to choose?</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            id="tourId"
                                                            value={mainForm.tourId}
                                                            placeholder="Enter tour id"
                                                            onChange={(e) => updateFormFields("tourId", e.target.value)}
                                                            isInvalid={!!formErrors.tourId}
                                                        ></Form.Control>
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors.tourId}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Form.Group as={Col} md="6" className="mb-3">
                                                        <Form.Label>User name</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            id="userName"
                                                            value={mainForm.userName}
                                                            placeholder="Enter user's name"
                                                            onChange={(e) => updateFormFields("userName", e.target.value)}
                                                            isInvalid={!!formErrors.userName}
                                                        ></Form.Control>
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors.userName}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="6" className="mb-3">
                                                        <Form.Label>User Email</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            id="userEmail"
                                                            value={mainForm.userEmail}
                                                            placeholder="Enter user's email"
                                                            onChange={(e) => updateFormFields("userEmail", e.target.value)}
                                                            isInvalid={!!formErrors.userEmail}
                                                        ></Form.Control>
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors.userEmail}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="6" className="mb-3">
                                                        <Form.Label>Number of additional guests</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="number"
                                                            id="additionalGuests"
                                                            value={mainForm.additionalGuests}
                                                            placeholder="Enter number of additional guests"
                                                            onChange={(e) => updateFormFields("additionalGuests", e.target.value)}
                                                            isInvalid={!!formErrors.additionalGuests}
                                                        ></Form.Control>
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors.additionalGuests}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="6" className="mb-3">
                                                        <Form.Label>What date do you plan to visit? (MM/dd/YYY)</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            id="tourDate"
                                                            value={mainForm.tourDate}
                                                            placeholder="Enter date"
                                                            onChange={(e) => updateFormFields("tourDate", e.target.value)}
                                                            isInvalid={!!formErrors.tourDate}
                                                        ></Form.Control>
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors.tourDate}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="6" className="mb-3">
                                                        <Form.Label>Any custom requests?</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="customRequests"
                                                            value={mainForm.customRequests}
                                                            placeholder="Enter request"
                                                            onChange={(e) => updateFormFields("customRequests", e.target.value)}
                                                            isInvalid={!!formErrors.customRequests}
                                                        ></Form.Control>
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors.customRequests}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Row>
                                                <hr className="mb-1"></hr>
                                                <Row className="justify-content-md-center">
                                                    <Form.Group as={Col} md="6">
                                                        <div className="d-grid">
                                                            <Button as="input" type="submit" value="Submit" size="lg" />
                                                        </div>
                                                    </Form.Group>
                                                </Row>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </Row>
                        </div>}
                </Container>}
            {
                null == localStorageEmail &&
                <Container>
                    <h1 className="py-3 text-center">Oops, Kindly login to book tours</h1>
                </Container>
            }
        </div>
    )
}

export default BookTour