import React from 'react'
import styled from 'styled-components'
import { teamMembers } from '../../teamMembers'

const TeamSection = styled.section`
  text-align: center;
`

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: black;
`

const TeamDescription = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 800px;
  margin-bottom: 3rem;
`
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const TeamMemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 20px;
`

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`

const MemberName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0b0b0b;
  margin: 5px 0;
`

const MemberBio = styled.p`
  font-size: 1rem;
  color: #6b7280;
  text-align: center;
  margin-top: 0.5rem;
`

const About = () => {
  return (
    <div>
      <TeamSection>
            <SectionTitle>Team Info</SectionTitle>
            <TeamDescription>
            Here are our team member, we're in the same class of CS4241 and we want to build a host page for our games.
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