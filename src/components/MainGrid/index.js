import styled from 'styled-components';

const MainGrid = styled.main`
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  grid-gap: 10px;
  padding: 16px;

  .luckMessage {
    color: var(--colorPrimary);
    font-size: 14px;
    font-family: sans-serif;
  }

  .profileArea {
    display: none;
    @media(min-width:860px){
      display: block;
    }
  }

  @media(min-width: 860px){
    max-width: 1110px;
    display: grid;
    grid-template-areas: "profileArea welcomeArea profileRelationsArea";
    grid-template-columns: 160px 1fr 312px;
  }
`;

export default MainGrid;