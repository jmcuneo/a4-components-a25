import React from 'react'
import styled from 'styled-components'
import { gameDataStorage } from '../../GameDataStorage'

const FeatureSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); //fit as many column as we can
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem 0;
  width: 100%;
`

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(236, 72, 153, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.1);
    border-color: rgba(236, 72, 153, 0.3);
  }
`

const FeatureThumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  width: 100%;
  height: 220px;
`

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.5;
  font-size: 0.95rem;
`

const GameLink = styled.a`
  text-decoration: none;
  display: flex;
`

const GameMenu = () => {
  return (
    <FeatureSection>
        {gameDataStorage.map((eachGame)=>(
          <GameLink href={eachGame.link} key={eachGame.id}>
            <FeatureCard key={eachGame.id}>
              <FeatureThumbnail src={eachGame.thumbnail} alt={eachGame.name}></FeatureThumbnail>
              <FeatureTitle>{eachGame.name}</FeatureTitle>
              <FeatureDescription>{eachGame.description}</FeatureDescription>
            </FeatureCard>
          </GameLink>
        ))}
    </FeatureSection>
  )
}

export default GameMenu