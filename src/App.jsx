import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Intro from './Pages/Intro'
import GameMenu from './Pages/GameMenu'
import About from './Pages/About'
import SectionWrapper from './Components/SectionWrapper'

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <SectionWrapper id="welcome"><Intro></Intro></SectionWrapper>
      <SectionWrapper id="games"><GameMenu></GameMenu></SectionWrapper>
      <SectionWrapper id="about"><About></About></SectionWrapper>
    </div>
  )
}

export default App
