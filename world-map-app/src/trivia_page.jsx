import React from "react";
import { Link } from 'react-router-dom';
import './trivia.css';

export default function TriviaPage(){
    return(
        <div>
            <div className = 'navbar'>
                <Link to="/">Home</Link>
                <Link to="/trivia">Go to Trivia Page</Link>
            </div>
            <h1>Welcome To The Trivia</h1>
        </div>

    )
}