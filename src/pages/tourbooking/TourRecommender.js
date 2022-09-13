import { Button, Col, Form, Row, Container, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../../components/Header/Header"
import { useState, useEffect } from "react";
import { viewAvailableTours, recommendGenricTours, recommendToursWithDays } from "./BookTourApiCalls";


const TourRecommender = () => {

    
    const [requestSubmitted, setRequestSubmitted] = useState(false)
    const [tours, setTours] = useState([])
    const [recommendedTours, setRecommendedTours] = useState([])

    const localStorageUserId = localStorage.getItem('userId')
    const localStorageEmail = localStorage.getItem('email')

    console.log('Local Storage User Id', localStorageUserId)
    console.log('Local Storage Email', localStorageEmail)


    //Main tourbooking form
    const [mainForm, setMainForm] = useState({
        userId: "1", //localstorage
        userEmail: "", //localstorage
        additionalGuests: "",
        tourCost: "",
        tourDays: "",
    })

    //Form errors
    const [formErrors, setFormErrors] = useState({});
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        viewAvailableTours().then((response) => {
            if (response.message === 'successs') {
                setTours(response.data)
            }
        });

    }, []);


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
        if (!isNumeric(mainForm.tourCost)) {
            errors.tourCost = "Enter valid tour cost";
        }
        if (!isNumeric(mainForm.tourDays)) {
            errors.tourDays = "Enter valid tour days";
        }
        if (!isNumeric(mainForm.additionalGuests)) {
            errors.additionalGuests = "Enter valid number of guests";
        }

        return errors
    }

    function isNumeric(input) {
        if (typeof input != "string") return false
        return !isNaN(input) && !isNaN(parseFloat(input))
    }

    //On submitting form
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const currentErrors = validateForm();
        if (Object.keys(currentErrors).length > 0) {
            setFormErrors(currentErrors);
            setValidated(false);
        } else {
            setRequestSubmitted(true)
            console.log('Form validated successfully', mainForm)
            setValidated(true);
            setFormErrors([])
            var validTourDays = false;
            for (let i = 0; i < tours.length; i++) {
                let obj = tours[i];
                if (obj.tourDays === mainForm.tourDays) {
                    validTourDays = true
                    break
                }
            }
            // GET API - Cloud function to fetch recommendations authored by Parvish Vijay Gajjar (B00912090)
            if (validTourDays) {
                recommendToursWithDays(mainForm.tourDays).then((response) => {
                    if (response.status == "success") {
                        console.log('Response ', response)
                        setValidated(true);
                        setFormErrors([])
                        setRecommendedTours(response.data)
                    } else {
                        setValidated(false);
                        setFormErrors({
                            message: "Failed to book a tour. Please try again",
                        });
                    }
                });
            } else {
                recommendGenricTours(mainForm.tourDays).then((response) => {
                    if (response.status == "success") {
                        console.log('Response ', response)
                        setValidated(true);
                        setFormErrors([])
                        setRecommendedTours(response.data)
                    } else {
                        setValidated(false);
                        setFormErrors({
                            message: "Failed to book a tour. Please try again",
                        });
                    }
                });
            }
        }
    };

    return (
        <div>
            <div>
                <Header />
            </div>
            {
                null != localStorageEmail &&

                <Container>
                    <div className="py-3 text-center">
                        <h1>Recommend Tours</h1>
                    </div>
                    <div>
                        <Row>
                            <div>
                                <Form onSubmit={handleSubmit} validated={validated}>
                                    <h4 className="mb-3">Tour</h4>
                                    <div className="d-block my-3">
                                        <Row>
                                            <Form.Group as={Col} md="6" className="mb-3">
                                                <Form.Label>What are your estimated costs for the tour</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    id="tourCost"
                                                    value={mainForm.tourCost}
                                                    placeholder="Enter tour cost"
                                                    onChange={(e) => updateFormFields("tourCost", e.target.value)}
                                                    isInvalid={!!formErrors.tourCost}
                                                ></Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.tourCost}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="6" className="mb-3">
                                                <Form.Label>What is the expected number of days you would like for the tour?</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    id="tourDays"
                                                    value={mainForm.tourDays}
                                                    placeholder="Enter number of days"
                                                    onChange={(e) => updateFormFields("tourDays", e.target.value)}
                                                    isInvalid={!!formErrors.tourDays}
                                                ></Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.tourDays}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} md="6" className="mb-3">
                                                <Form.Label>How many guests are you expecting to accompany?</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    id="additionalGuests"
                                                    value={mainForm.additionalGuests}
                                                    placeholder="Enter guests"
                                                    onChange={(e) => updateFormFields("additionalGuests", e.target.value)}
                                                    isInvalid={!!formErrors.additionalGuests}
                                                ></Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors.additionalGuests}
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
                        </Row>
                    </div>
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
                                            recommendedTours.map((tour) => (
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
                    </div>
                </Container>
            }
            {
                null == localStorageEmail && 
                <Container>
                    <h1 className="py-3 text-center">Oops, Kindly login for tour recommendedations</h1>
                </Container>
            }
        </div>
    )
}

export default TourRecommender