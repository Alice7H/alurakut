import { typeOf } from "react-is";

export default function CommunityBox({ arrayList, title }) {
  return (
    <>
      <h2 className="smallTitle">
        {title} <a href="#" className="boxLink">({arrayList.length})</a>
      </h2>
      <ul>
        {
          arrayList.slice(0, 6).map((item) => {
            const number = Math.round(Math.random() * 10);
            if (typeof item == 'string') {
              return (
                <li key={item}>
                  <a href={`https://github.com/${item}`} target="_blank" rel="noopener noreferrer">
                    <img src={`https://github.com/${item}.png` || `https://picsum.photos/300/300?random=${number}`} alt={item} />
                    <span>{item}</span>
                  </a>
                </li>
              );
            }
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
    </>
  );
}