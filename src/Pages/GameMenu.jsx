import React from 'react'
import styled from 'styled-components'
import { gameDataStorage } from '../../GameDataStorage'

const GameSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); //fit as many column as we can
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem 0;
  width: 100%;
`

const GameCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid black;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`

const GameThumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  width: 100%;
  height: 220px;
`

const GameTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
`

const GameDescription = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
`

const GameLink = styled.a`
  text-decoration: none;
  display: flex;
`

const GameMenu = () => {
  return (
    <GameSection>
        {gameDataStorage.map((eachGame)=>(
          <GameLink href={eachGame.link} target="_blank" key={eachGame.id}>
            <GameCard key={eachGame.id}>
              <GameThumbnail src={eachGame.thumbnail} alt={eachGame.name}></GameThumbnail>
              <GameTitle>{eachGame.name}</GameTitle>
              <GameDescription>{eachGame.description}</GameDescription>
            </GameCard>
          </GameLink>
        ))}
    </GameSection>
  )
}

export default GameMenu