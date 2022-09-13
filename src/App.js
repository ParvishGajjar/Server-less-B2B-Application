import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import FoodOrder from './pages/FoodOrder/FoodOrder';
import SignUpForm from "./pages/SignUp/SignUpForm";
import Login from "./pages/Login/Login";
import SecurityQuestion from "./pages/SecurityQuestion/SecurityQuestion";
import CaesarCipher from "./pages/CaesarCipher/CaesarCipher";
import BookTour from './pages/tourbooking/BookTour';
import ChatBotEmbedder from './pages/chatbot/ChatbotEmbedder';
import TourRecommender from './pages/tourbooking/TourRecommender';
import Invoice from './pages/Invoice/Invoice';
import AvailableRooms from "./pages/HotelManagement/AvailableRooms";
import Visuals from "./pages/Visualizations/Visuals";
import Reports from "./pages/Visualizations/Reports";
import Hotel from './pages/HotelManagement/Hotel';
import Feedback from './pages/Feedback/Feedback';
import ViewIncomeCharts from "./pages/Visualizations/IncomeCharts.jsx"

function App() {
  return (
    <div>
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/OrderFood" element={<FoodOrder />} />
                <Route exact path='/sign-up' element={<SignUpForm />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/securityQuestion' element={<SecurityQuestion />} />
                <Route exact path='/caesarCipher' element={<CaesarCipher />} />
                <Route exact path='/bookTour' element = { <BookTour/> } />
                <Route exact path='/recommendTour' element = {<TourRecommender />} />
                <Route exact path='/Invoice' element = { <Invoice/> } />
                <Route exact path="/ViewAvailableRooms" element={<AvailableRooms />}/>
                <Route exact path="/ViewVisualizations" element={<Visuals />} />
                <Route exact path="/ViewReports" element={<Reports />} />
                <Route exact path="/Hotel" element={<Hotel />} />
                <Route exact path="/Feedback" element={<Feedback />} />
                <Route exact path="/ViewIncomeCharts" element={<ViewIncomeCharts />} />
            </Routes>
        </Router>
        <ChatBotEmbedder></ChatBotEmbedder>
    </div>
  )
}

export default App