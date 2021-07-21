import styled from 'styled-components';

const ProfileTable = styled.table`
  border-radius: 8px;
  border-collapse: collapse;
  border-spacing: 0;
  box-sizing: border-box;
  line-height: 25px;
  padding: 20px;
  overflow-x: auto;
  display: flex;
  justify-content: center;
  @media(max-width: 400px) {
    display: block;
  }
  td {
    padding: 10px;
    width:50%;
  }
  tr:nth-child(even) {
    background: var(--backgroundPrimary);
  }
  tr:nth-child(odd) {
    background: var(--backgroundQuarternary);
  }
  .text-right {
    text-align: end;
    color: var(--colorTertiary);
  }

  .text-left {
    text-align: start;
    color: var(--colorTertiary);
  }
`
export default ProfileTable;