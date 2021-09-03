import styled from 'styled-components';

const MainTable = styled.table`
  width: 100%;
  border-spacing: 0;
  margin-top: 24px;
  overflow: auto;
  @media(max-width: 400px) {
    display: block;
    img {
      width: 50px;
      height: 40px;
      border-radius: 50%;
    }
  }
  td {
    padding: 10px;
  }
  tr:nth-child(even) {
    background: var(--backgroundPrimary);
  }
  tr:nth-child(odd) {
    background: var(--backgroundQuarternary);
    width: 100%;
  }
  .text-right {
    text-align: end;
    color: var(--colorTertiary);
  }
  .text-left {
    text-align: start;
    color: var(--colorTertiary);
  }
  img {
    width: 90px;
    height: 80px;
    border-radius: 50%;
  }
  a { text-decoration: none;}
  .table-title {
    color: var(--colorSecondary); 
    font-size: 16px;
  }
  .table-members {
    margin-top: 10px;
    color: var(--textTertiaryColor);
  }

`
export default MainTable;