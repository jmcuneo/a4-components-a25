import React from 'react'
import styled from 'styled-components'

const Navigation = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 2rem;
  background: rgba(253, 242, 248, 0.9);
  backdrop-filter: blur(10px); // partially transparent level for the scene behind
  z-index: 100;
`
const NavList = styled.ul`
  display: flex;
  justify-content: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`

const NavItem = styled.a`
  font-size: 0.9rem;
  font-weight: 500;
  color: #be185d;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: color 0.3s ease;
  text-decoration: none;
  
  &:hover {
    color: #ec4899;
  }
`

const Navbar = () => {
  return (
    <Navigation>
        <NavList>
          <NavItem href="#welcome">Welcome</NavItem>
          <NavItem href="#games">Games</NavItem>
          <NavItem href="#about">About</NavItem>
        </NavList>
    </Navigation>
  )
}

export default Navbar