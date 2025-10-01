import React from 'react'
import styled from 'styled-components'
import { gameDataStorage } from '../../GameDataStorage'

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`

const MainTitle = styled.h1`
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 900;
  color: #1f2937;
  margin: 0;
  line-height: 0.9;
  text-align: center;
  margin-bottom: 1rem;
`

const SubTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 5rem);
  font-weight: 700;
  color: #be185d;
  margin: 0;
  line-height: 0.9;
  text-align: center;
  font-style: italic;

`

const Description = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
  margin: 2rem 0;
`
const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  margin: 3rem 0;
`

const StatItem = styled.div`
  text-align: center;
`

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #ec4899;
  line-height: 1;
`

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
`

const Intro = () => {
  //this will be adjusted in the future when using database
  const numOfGame = gameDataStorage.length;
  const authorsSet = new Set();
  
  for(const game of gameDataStorage) {
    authorsSet.add(game.author);
  }

  //calculating time
  const start = new Date("2025-09-01"); // September 1, 2025
  const now = new Date();

  const diffMs = now.getTime() - start.getTime(); // milliseconds difference
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365); // rough years


  return (
    <div>
        <Header>
            <MainTitle>GAME</MainTitle>
            <SubTitle>HUB</SubTitle>
            <Description>
                Welcome to our collaborative gaming universe! This is where our talented team showcases all the incredible
                games we've created together. From indie adventures to innovative experiences, discover the passion and
                creativity that drives our development journey.
            </Description>
        </Header>

        <StatsContainer>
            <StatItem>
                <StatNumber>{numOfGame}+</StatNumber>
                <StatLabel>Games Created</StatLabel>
            </StatItem>
            <StatItem>
                <StatNumber>{authorsSet.size}</StatNumber>
                <StatLabel>Team Members</StatLabel>
            </StatItem>
            <StatItem>
                <StatNumber>{diffYears.toFixed(1)}</StatNumber>
                <StatLabel>Years Active</StatLabel>
            </StatItem>
        </StatsContainer>
    </div>
  )
}

export default Intro