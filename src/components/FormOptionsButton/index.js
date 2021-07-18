import styled from 'styled-components';

export const FormOptionsButton = styled.li`
    display: flex;
    justify-content: left;
    gap: 10px;
    list-style-type: none;
    margin-right: 10px;
    padding: 9px 12px;
    margin-bottom: 10px;

    button {
      background: #D9E6F6;
      color: #2E7BB4;
      border-radius: 8px;
    }

    button.isActive {
      background: #6F92BB;
      color: #FFFFFF;
    }

    @media(max-width: 365px) {
      flex-direction: column;
    }
`;