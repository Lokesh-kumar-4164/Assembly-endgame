import React from 'react'
import {languages} from './languages'
import Language from "./Language.jsx"
import {nanoid} from "nanoid"
import {getFarewellText} from './utils.js'
import clsx from "clsx"
import { getRandomWord } from './utils.js'
import Confetti from 'react-confetti'

export default function App(){
  // () => getRandomWord()
  const [currentWord,setCurrentWord] = React.useState(() => getRandomWord())
  const [clickedArray,setClickedArray] = React.useState([])
   
  let wrongGuessCount =0;
  for(let letter of clickedArray){
    if(!currentWord.includes(letter)) wrongGuessCount+=1
  }
  const isGameWon = currentWord.split("").every(letter => clickedArray.includes(letter))
  const isGameLost = wrongGuessCount>=languages.length-1 && !isGameWon 

  const languageBlocks = languages.map((e,i) => {
      return  < Language 
        isStruckOff={wrongGuessCount>i?true:false}
        key={nanoid()}
        name={e.name} 
        backgroundColor={e.backgroundColor}
        color={e.color}
      />
  })

 

  function storeInState(letter){
    setClickedArray(prevClickedArray =>{
        const letterSet = new Set(prevClickedArray)
        letterSet.add(letter)
        return Array.from(letterSet)
    }
    ) 
  }
  
 

 const alphabets = "qwertyuiopasdfghjklzxcvbnm" 
 const alphabetsArray = alphabets.split("").map(alpha => {
    const isGuessed = clickedArray.includes(alpha)
    const isCorrect = isGuessed && currentWord.includes(alpha)
    const isWrong = isGuessed && !currentWord.includes(alpha)
    return <button 
    key={nanoid()} 
    disabled={isGameLost || isGameWon}
    onClick={() => storeInState(alpha)} 
    className={clsx("alphabet",{"letter-exists":isCorrect,"letter-wont-exist":isWrong })}
    >{alpha.toUpperCase()}</button>
 })

 const missedLetters = currentWord.split("").map(letter => {
    return clickedArray.includes(letter)? null:letter
 })

 const mapOfWord = currentWord.split('').map((e) => {
  const shouldReveal = isGameLost || clickedArray.includes(e)
  return (
    <span key={nanoid()} className={clsx("letter-chosen ",{'red-letter':isGameLost && missedLetters.includes(e)})}>
      {shouldReveal? e.toUpperCase():null}
    </span>
    )
 })

 function displayStatus(){
    if(isGameWon){
      return (<>
          <h1>You win!</h1>
          <h2> Well done</h2>
      </>)
    }else if(isGameLost){
      return (<>  
          <h1>You lost</h1>
          <h2>Start learning assembly again 😭😭</h2>
      </>)
    }else{
       if(wrongGuessCount>0 && !currentWord.includes(clickedArray[clickedArray.length -1])){
        return <> {getFarewellText(languages[wrongGuessCount-1].name)}</>
       }
          
    }
 }

 function startNewGame(){
  setClickedArray([])
  setCurrentWord(getRandomWord())

 }

  return (

    <div className="outer-div">
      
      <div  className="header-section">
        {isGameWon && <Confetti height="1000px" width="1700px"/>}
        <h1>Assembly End Game</h1>
        <p>Guess the word under 8 attempts to save the world from assembly</p>
      </div>
      <section className={clsx("winning-div",{'losing-div':isGameLost,
        'fare-well':(!(isGameLost || isGameWon) && wrongGuessCount>0),
        'hidden':wrongGuessCount==0 && !isGameWon
      })}>
          {displayStatus()}
      </section>
      

      <div className='spacer'></div>
      <div className='languages-container'>
        {languageBlocks}  
      </div>
      <div className='spacer'></div>
      <div>
        {mapOfWord}
      </div>
      <div className='spacer'></div>
      <div className='keyboard'>{alphabetsArray}</div>
      {(isGameLost || isGameWon) && <button onClick={startNewGame} className='new-game-btn'>New Game</button>}
    </div>
  )
}