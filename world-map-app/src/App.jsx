import React from "react";
import Home from "./home";
import TriviaPage from "./trivia_page";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element= {<Home/>} />
        <Route path="/trivia" element= {<TriviaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
