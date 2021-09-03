import styled from 'styled-components';
import Box from '../Box';
import toast, { Toaster } from 'react-hot-toast';

export function ScrapForm(props) {
  function handleCreateScrap(event) {
    event.preventDefault();
    const dataForm = new FormData(event.target);
    const scrap = {
      message: dataForm.get('message'),
      author: props.githubUser,
      receiveUser: dataForm.get('receiveUser'),
      image: dataForm.get('image'),
    }

    fetch('/api/scraps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scrap),
    }).then(async (response) => {
      const result = await response.json();
      const scrap = result.registerCreated;
      if (scrap) {
        toast.success('Scrap criado com sucesso');
        event.target.reset();
      }
    }).catch(error => { console.log(error); })
  }

  return (
    <form onSubmit={handleCreateScrap}>
      <Toaster />
      <div>
        <input
          placeholder="Deixe um recado"
          name="message"
          type="text"
          required
          aria-label="Deixe um recado"
          required
        />
      </div>
      <div>
        <input
          placeholder="Adicione uma url da imagem"
          name="image"
          type="text"
          aria-label="Adicione uma url da imagem"
        />
      </div>
      <div>
        <input type="text"
          placeholder="Para quem quer enviar o recado?"
          name="receiveUser"
          type="text"
          required
          aria-label="Para quem quer enviar o recado?"
        />
      </div>
      <button>
        Criar um recado
      </button>
    </form>
  )
}

export function ScrapBox({ message, arrayList }) {
  return (
    <ScrapBox.Wrapper>
      <h2 className="smallTitle">{message} ({arrayList.length})</h2>
      <ul>
        {
          arrayList.slice(0, 10).map((item) => {
            const options = {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            };
            const date = new Date(item.createdAt).toLocaleString('pt-BR', options);
            return (
              <li key={item.id}>
                <div>
                  <p>De: {item.author}</p>
                  <p>Para: {item.receiveUser}</p>
                  <p>{date}</p>
                </div>
                {
                  item.image && <img src={item.image} alt={item.image?.title} />
                }
                <p>{item.message}</p>
                <hr />
              </li>
            );
          })
        }
      </ul>
    </ScrapBox.Wrapper>
  );
}

ScrapBox.Wrapper = styled(Box)`
  ul {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr; 
    list-style: none;
  }
  li div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 20px;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
  }

  p {
    color: var(--colorPrimary);
  }
  
  @media(max-width: 399px) {
      li div {
        flex-direction: column;
        gap: none;
      }
  }
`;