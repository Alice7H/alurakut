import { useState } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = useState('Alice7H');

  async function handleUserGithubExist() {
    const resultado = await fetch(`https://api.github.com/users/${githubUser}`)
    const data = await resultado.json();
    if (!data || data.message == 'NOT FOUND') {
      return false;
    }
    return true;
  }

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Toaster position="top-right" />
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={async (event) => {
            event.preventDefault();

            const userExist = await handleUserGithubExist();
            if (userExist) {
              fetch('https://alurakut.vercel.app/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ githubUser: githubUser }),
              })
                .then(async (response) => {
                  const data = await response.json();
                  const token = data.token;
                  nookies.set(null, 'USER_TOKEN', token, {
                    path: '/',
                    maxAge: 86400 * 7,
                  });
                  router.push('/');
                })
                .catch(error => toast(`Erro - ${error}`));
            } else {
              toast('Usuário inválido');
            }
          }}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input placeholder="Usuário"
              value={githubUser}
              onChange={(event) => {
                setGithubUser(event.target.value);
              }}
            />
            {
              githubUser.length == 0 && 'Preencha o campo'
            }
            <button type="submit">Login</button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="https://github.com" alt="Github account" target="_blank" rel="noopener noreferrer">
                <strong>
                  ENTRAR JÁ
                </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
}