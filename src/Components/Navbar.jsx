import React from 'react'
import styled from 'styled-components'

const Navigation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: white;
  z-index: 100;
`
const NavList = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`

const NavItem = styled.a`
  font-size: 1.5rem;
  font-weight: 500;
  color: black;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    color: #d43a91;
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