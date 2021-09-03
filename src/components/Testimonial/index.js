import styled from 'styled-components';
import Box from '../Box';
import parse from 'html-react-parser';
import dynamic from "next/dynamic";
import toast, { Toaster } from 'react-hot-toast';

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export function TestimonialForm(props) {
  function handleCreateTestimonial(event) {
    event.preventDefault();
    const dataForm = new FormData(event.target);

    const testimonial = {
      message: dataForm.get('message'),
      author: props.githubUser,
      receiveUser: dataForm.get('receiveUser'),
    }

    fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial),
    }).then(async (response) => {
      const result = await response.json();
      const testimonial = result.registerCreated;
      if (testimonial) {
        toast.success('Depoimento criado com sucesso');
        event.target.reset();
        const editorContent = document.querySelector('.sun-editor-editable').children;
        [...editorContent].map(res => {
          res.innerText = '';
        });
      }
    }).catch(error => { console.log(error); })
  }

  return (
    <form onSubmit={handleCreateTestimonial}>
      <Toaster />
      <div style={{ margin: '10px 0' }}>
        <SunEditor
          name="message"
          placeholder="Deixe um depoimento"
          aria-label="Deixe um depoimento"
          autoFocus={true}
          required
          setDefaultStyle="font-family: sans-serif; font-size: 14px"
          setOptions={{
            height: 200,
            formats: [
              'p', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
            ],
            linkProtocol: ('link'),
            linkRelDefault: {
              default: 'nofollow',
              check_new_window: 'noreferrer noopener',
            },
            addTagsWhitelist: "code",
            buttonList: [
              [
                "undo", "redo",
                "formatBlock",
                "align",
                "bold", "underline", "italic",
                "list",
                "link",
                "removeFormat",
                "outdent", "indent",
                "lineHeight",
              ]
            ]
          }}
        />
      </div>
      <div>
        <input type="text"
          placeholder="Para quem quer enviar o depoimento?"
          name="receiveUser"
          type="text"
          required
          aria-label="Para quem quer enviar o depoimento?"
        />
      </div>
      <button>
        Criar depoimento
      </button>
    </form>
  )
}

export function TestimonialBox({ message, arrayList }) {
  return (
    <TestimonialBox.Wrapper>
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
                <div className="testimonial__header">
                  <p>De: {item.author}</p>
                  <p>Para: {item.receiveUser}</p>
                  <p>{date}</p>
                </div>
                <div className="testimonial__body">
                  {parse(item.message)}
                </div>
                <hr />
              </li>
            );
          })
        }
      </ul>
    </TestimonialBox.Wrapper>
  );
}

TestimonialBox.Wrapper = styled(Box)`
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

  .testimonial__header p {
    color: var(--colorPrimary);
  }

  .testimonial__body {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
    margin-bottom: 20px;
  }

  pre {
    background-color: black;
    color: white;
    border-radius: 3px;
    padding: 10px;
    overflow-x: scroll;
  }

  @media(max-width: 399px) {
      li div {
        flex-direction: column;
        gap: none;
      }
  }
`;