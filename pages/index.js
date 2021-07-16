import React, { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import ProfileRelationsBox from '../src/components/ProfileRelations';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AluraKutCommons';

function ProfileSideBar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} alt="profile" style={{ borderRadius: '8px' }} />
      <hr />
      <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
        @{props.githubUser}
      </a>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home() {
  const githubUser = 'Alice7H';
  const [followers, setFollowers] = useState([]);
  const [communities, setCommunities] = useState([
    {
      id: '1234',
      title: 'Eu odeio acordar cedo',
      image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
      link: 'https://www.alura.com.br/',
      author: 'Alice7H'
    },
    {
      id: '5678',
      title: 'Dev frontend',
      image: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
      link: 'https://www.codecademy.com',
      author: 'Alice7H',
    },
    {
      id: '91011',
      title: 'Vem vacina',
      image: 'https://cdn.pixabay.com/photo/2020/09/21/16/43/coronavirus-5590560_960_720.png',
      link: 'https://www.vacinaja.sp.gov.br/',
      author: 'Alice7H',
    },
    {
      id: '1213',
      title: 'EU AMO CHOCOLATE',
      image: 'https://i1.wp.com/socialnutrition.com/wp-content/uploads/2013/10/66fd5-stress.jpg?ssl=1',
      link: 'https://www.orkut.br.com/',
      author: 'Alice7H',
    },
    {
      id: '1415',
      title: 'Só observo',
      image: 'https://img10.orkut.br.com/community/3308e7b5090febc56e28aad0bb242620.png',
      link: 'https://github.com/Alice7H/',
      author: 'Alice7H',
    },
    {
      id: '1617',
      title: 'Eu jogo DBD',
      image: 'https://image.api.playstation.com/vulcan/ap/rnd/202009/2104/Aucq98d7qLkiLdOYJgrPEEhg.png',
      link: 'https://www.playstation.com/pt-br/',
      author: 'Alice7H',
    },
  ]);
  const favoritePeople = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'miltonmartins',
  ];

  useEffect(() => {
    function getFollowers() {
      fetch('https://api.github.com/users/Alice7H/followers')
        .then(res => res.json())
        .then(res => {
          res.map(item => {
            const follower = {
              id: item.id,
              title: item.login,
              image: item.avatar_url,
              link: item.html_url,
            }
            const updatedFollower = [...followers, follower];
            setFollowers(updatedFollower);
          })
        });
    }
    getFollowers();
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={function handleCreateCommunity(event) {
              event.preventDefault();
              const dadosDoForm = new FormData(event.target);

              const community = {
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
                link: dadosDoForm.get('link'),
                author: githubUser,
              }
              const updatedCommunities = [...communities, community];
              setCommunities(updatedCommunities);
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  type="text"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  required
                />
              </div>
              <div>
                <input
                  placeholder="Adicione uma url para usar de capa"
                  name="image"
                  type="text"
                  aria-label="Adicione uma url para usar de capa"
                />
              </div>
              <div>
                <input
                  placeholder="Adicione a url da sua comunidade"
                  name="link"
                  type="text"
                  aria-label="Adicione a url da sua comunidade"
                  required
                />
              </div>
              <button>
                Criar community
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox
            title={communities.length > 1 ? 'Comunidades' : 'Comunidade'}
            arrayList={communities} />

          <ProfileRelationsBox
            title="Pessoas da comunidade"
            arrayList={favoritePeople} />

          <ProfileRelationsBox
            title={followers.length > 1 ? 'Seguidores' : 'Seguidor'}
            arrayList={followers} />
        </div>
      </MainGrid>
    </>
  )
}
