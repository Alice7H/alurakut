import React, { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import CommunityForm from '../src/components/Community';
import { ScrapForm } from '../src/components/Scrap';
import { TestimonialForm } from '../src/components/Testimonial';
import ProfileSideBar from '../src/components/ProfileSideBar';
import ProfileRelationsBox from '../src/components/ProfileRelations';
import { FormOptionsButton } from '../src/components/FormOptionsButton';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import 'suneditor/dist/css/suneditor.min.css';
import toast, { Toaster } from 'react-hot-toast';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { useCheckAuth } from '../src/hooks/useCheckAuth';

export default function Home(props) {
  const githubUser = props.githubUser;
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [activeForm, setActiveForm] = useState('community');
  const [aleatoryMsg, setAleatoryMsg] = useState([
    'Aquilo que sonha hoje, pode muito bem tornar-se realidade amanhã.',
    'Pare de procurar eternamente, a felicidade está o seu lado.',
    'Sua mente é criativa, original e perspicaz.',
    'Primeiro, saiba qual é sua prioridade.',
    'A sorte está a caminho! Muito trabalho, dedicação e pensamento positivo!',
    'O importante na vida não é tanto onde estamos, mas em que direção caminhamos.',
    'Quando se decide tomar uma decisão, é preciso colocá-la em prática.'
  ]);

  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;

  function getFollowers() {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Requisição não completada.');
      })
      .then(res => {
        const auxArray = [];
        res.map(item => {
          const follower = {
            id: item.id,
            title: item.login,
            image: item.avatar_url,
            link: item.html_url,
          }
          auxArray.push(follower);
        })
        setFollowers(auxArray);
      }).catch((error) => {
        console.log(error);
      });
  }

  function getFollowing() {
    fetch(`https://api.github.com/users/${githubUser}/following`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Requisição não completada.');
      })
      .then(res => {
        const auxArray = [];
        res.map(item => {
          const follow = {
            id: item.id,
            title: item.login,
            image: item.avatar_url,
            link: item.html_url,
          }
          auxArray.push(follow);
        })
        setFollowing(auxArray);
      }).catch((error) => {
        console.log(error);
      });
  }

  function getCommunities() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            id
            title
            image
            link
            author
          }
        }`
      }),
    }).then(res => res.json())
      .then((res) => {
        const comunidadesDato = res.data.allCommunities;
        setCommunities(comunidadesDato);
      })
      .catch((error) => {
        console.log(error);
        toast(`Error: ${error}`);
      });
  }

  function handleAleatoryMessage() {
    const number = Math.round(Math.random() * 6);
    const msg = aleatoryMsg[number];
    setAleatoryMsg(msg);
  }

  useEffect(() => {
    getFollowers();
    getFollowing();
    getCommunities();
    handleAleatoryMessage();
  }, []);

  function handleUpdateCommunity(communities) {
    setCommunities(communities);
    toast.success('Comunidade atualizada com sucesso');
  }

  return (
    <>
      <Toaster />
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a), {githubUser}</h1>
            <p className="luckMessage">Sorte de hoje: {aleatoryMsg}</p>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <FormOptionsButton>
              <button
                className={activeForm == "community" ? "isActive" : ""}
                onClick={() => setActiveForm('community')}
              >
                Criar comunidade
              </button>

              <button
                className={activeForm == "testimonial" ? "isActive" : ""}
                onClick={() => setActiveForm('testimonial')}
              >
                Escrever depoimento
              </button>

              <button
                className={activeForm == "scrap" ? "isActive" : ""}
                onClick={() => setActiveForm('scrap')}
              >
                Deixar um scrap
              </button>
            </FormOptionsButton>

            {activeForm == 'community' ?
              <CommunityForm
                githubUser={githubUser}
                communities={communities}
                handleUpdateCommunity={handleUpdateCommunity}
              />
              : activeForm == 'scrap'
                ? <ScrapForm githubUser={githubUser} />
                : activeForm == 'testimonial'
                  ? <TestimonialForm githubUser={githubUser} />
                  : null
            }

          </Box>

        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox
            title={communities.length > 1 ? 'Comunidades' : 'Comunidade'}
            arrayList={communities} />

          <ProfileRelationsBox
            title="Seguindo"
            arrayList={following} />

          <ProfileRelationsBox
            title={followers.length > 1 ? 'Seguidores' : 'Seguidor'}
            arrayList={followers} />

        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const isAuthenticated = await useCheckAuth(token);

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token); // token decoded
  return {
    // will be passed to the page component as props
    props: {
      githubUser
    },
  }
}