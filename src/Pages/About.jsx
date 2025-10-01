import React from 'react'
import styled from 'styled-components'
import { teamMembers } from '../../teamMembers'

const TeamSection = styled.section`
  text-align: center;
  margin: 4rem 0;
`

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
`

const TeamDescription = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`

const TeamMemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(236, 72, 153, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.15);
    border-color: rgba(236, 72, 153, 0.3);
  }
`

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899, #be185d);
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.2);
`

const MemberName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0.5rem 0;
`

const MemberBio = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
  text-align: center;
  margin-top: 0.5rem;
`

const About = () => {
  return (
    <div>
        <TeamSection>
            <SectionTitle>Built by Passionate Developers</SectionTitle>
            <TeamDescription>
            Our team combines diverse skills in programming, design, art, and storytelling to create games that we're
            proud to share with the world.
            </TeamDescription>
      </TeamSection>
      <TeamGrid>
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index}>
              <Avatar src={member.avatar}></Avatar>
              <MemberName>{member.name}</MemberName>
              <MemberBio>{member.bio}</MemberBio>
            </TeamMemberCard>
          ))}
      </TeamGrid>
    </div>
  )
}

export default About