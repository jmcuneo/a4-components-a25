import styled from 'styled-components'

const SectionWrapper = styled.section`
    min-height: 100vh; //each section fill at least one screen
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%); //pink-ish color
    padding: 2rem 2rem;
    scroll-margin-top: 80px; // create some space for the navbar later
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default SectionWrapper