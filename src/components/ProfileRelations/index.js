import styled from 'styled-components';
import Box from '../Box';

export default function ProfileRelationsBox({ title, arrayList }) {
  return (
    <ProfileRelationsBox.Wrapper>
      <h2 className="smallTitle">
        {title} <a href="#" className="boxLink">({arrayList.length})</a>
      </h2>
      <ul>
        {
          arrayList.slice(0, 6).map((item) => {
            const number = Math.round(Math.random() * 10);
            return (
              <li key={item.id}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img src={item.image || `https://picsum.photos/300/300?random=${number}`} alt={item.title} />
                  <span>{item.title}</span>
                </a>
              </li>
            );
          })
        }
      </ul>
      <hr />
      <a href="" className="boxLink">Ver todos</a>
    </ProfileRelationsBox.Wrapper>
  );
}

ProfileRelationsBox.Wrapper = styled(Box)`
  ul {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr; 
    max-height: 220px;
    list-style: none;
  }
  img {
    object-fit: cover;
    background-position: center center;
    width: 100%;
    height: 100%;
    position: relative;
  }
  ul li a {
    display: inline-block;
    height: 102px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    span {
      color: #FFFFFF;
      font-size: 10px;
      position: absolute;
      left: 0;
      bottom: 10px;
      z-index: 2;
      padding: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-indeX: 1;
      background-image: linear-gradient(0deg,#00000073,transparent);
    }
  }
`;