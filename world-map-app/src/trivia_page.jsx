import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './trivia.css';

export default function TriviaPage(){
    const [started, getStarted] = useState(false);
    const [question, setQuestion] = useState(null);
    const[selected, setSelected] = useState(null)

    const getRandomCountries = async(countries)=>{
        // extracting the name and flag information and shuffling
        const shuffled = [...countries].sort(()=> 0.5 - Math.random()).map(country => ({
            name: country.name.common,
            flag: country.flags.png
        }))
        const correct = shuffled[0] // assigning the first country in the list to be the correct one
        const incorrect = shuffled.slice(1, 4); // Getting our incorrect options
        const options = [correct, ...incorrect].sort(()=> (0.5 - Math.random()))// Shuffling the options order

        
        return{correct: correct, options:options};
    }
    
    // Getting country data
    const start = async () => {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca3');
        const data = await res.json();
        const  question = await getRandomCountries(data);
        setQuestion(question);
        getStarted(true);
    };
    

    return(
        <div>
            {/* Navbar */}
            <div className = 'navbar'>
                <Link to="/">Home</Link>
                <Link to="/trivia">Trivia</Link>
            </div>
            
            <div className="container">
                <h1>Welcome To The Trivia</h1>
                
                {/* Trivia Functionality */}
                {!started ? (
                <button onClick={start}>START</button>
                ) : question ? (
                <div className="question">
                    <h2>Which country does this flag belong to?</h2>
                    <img src={question.correct.flag} alt="flag" width={100} /><br/>
                    <div>
                    {question.options.map((option, i) => (
                        <button onClick = {()=>setSelected(true)}  // Checking if a button has been clicked
                        className = {selected? option.name === question.correct.name? "correct": "incorrect"
                        :"" } key={i}> 
                            {option.name}   
                        </button>
                    ))}
                    </div>
                    
                </div>) : 
                (
                <p>Loading question...</p>
                )}
            </div>
        </div>

    )
}