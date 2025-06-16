import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './trivia.css';

export default function TriviaPage(){
    const [started, getStarted] = useState(false);
    const [question, setQuestion] = useState(null); // setting the trivia question
    const[selected, setSelected] = useState(false); //determines whether option button has been clicked
    const [rounds, setRounds] = useState(5); //setting the default number of rounds
    const [currentRound, setCurrentRound] = useState(0); // variable to store current round
    
    //Randomizing the countries
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

    //Getting country data and Setting question
    const loadNextQuestion = async()=>{
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca3');
        const data = await res.json();
        const  question = await getRandomCountries(data);
        setQuestion(question);
        setSelected(false);
    }
    
    // Starting the trivia
    const start = async () => {
        setCurrentRound(1)
        getStarted(true);
        loadNextQuestion();
    };

    //Processing trivia rounds
    function handleClick(){
        setSelected(true);
        setTimeout(() => {
            if (currentRound < rounds) {
                setCurrentRound(currentRound + 1);
                loadNextQuestion();
        }   else {
                alert("Trivia Complete!");
                getStarted(false);
                setCurrentRound(0);
                setQuestion(null);
                setSelected(false);
            }
        }, 1200);
    };
       
    return(
        <div>
            {/* Navbar */}
            <div className = 'navbar'>
                <Link to="/">Home</Link>
                <Link to="/trivia">Trivia</Link>
            </div>
            {/* Trivia Functionality */}
                {!started ? (
                <div className="container">
                    <h1>Welcome To The Trivia</h1>
                <   div className="button-flex-container">
                        <button onClick={()=>{setRounds(5), setSelected(5)}} className={selected === 5?"clicked":""}>5 Rounds</button>
                        <button onClick={()=>{setRounds(10),setSelected(10)}} className={selected === 10?"clicked":""}>10 Rounds</button>
                        <button onClick={()=>{setRounds(15), setSelected(15)}} className={selected === 15? "clicked":""}>15 Rounds</button>
                    </div>
                    <button onClick={start}>START</button>
                </div>
                ) : question ? (
                <div className="question">
                    <h2>Round {currentRound} of {rounds}</h2>
                    <h2>Which country does this flag belong to?</h2>
                    <img src={question.correct.flag} alt="flag" width={100} /><br/>
                    <div>
                    {question.options.map((option, i) => (
                        <button onClick={()=>handleClick()} 
                        className = {selected === true? option.name === question.correct.name? "correct": "incorrect"
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
        

    )
}