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
import { useFollowers } from '../src/hooks/useFollowers';
import { useFollowing } from '../src/hooks/useFollowing';
import { useScraps } from '../src/hooks/useScraps';
import { useTestimonials } from '../src/hooks/useTestimonials';
import { aleatoryMessages } from '../src/lib/AleatoryMessages';

export default function Home(props) {
  const githubUser = props.githubUser;
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;
  const followers = useFollowers(githubUser);
  const following = useFollowing(githubUser);
  const scraps = useScraps(githubUser);
  const testimonials = useTestimonials(githubUser);
  const [communities, setCommunities] = useState([]);
  const [activeForm, setActiveForm] = useState('community');
  const [aleatoryMsg, setAleatoryMsg] = useState(aleatoryMessages);

  function handleAleatoryMessage() {
    const number = Math.round(Math.random() * 6);
    const msg = aleatoryMsg[number];
    setAleatoryMsg(msg);
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
      .then(async (res) => {
        const communitiesDato = await res.data.allCommunities;
        setCommunities(communitiesDato);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleUpdateCommunity(cmt) {
    setCommunities(cmt);
    toast.success('Comunidade criada com sucesso');
  }

  useEffect(() => {
    getCommunities();
    handleAleatoryMessage();
  }, []);

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
            <OrkutNostalgicIconSet
              recados={scraps.length}
              fotos={following.length}
              fas={followers.length}
              mensagens={testimonials.length}
              confiavel={3}
              legal={3}
              sexy={2}
            />
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

            {
              activeForm == 'community' &&
              <CommunityForm
                githubUser={githubUser}
                communities={communities}
                handleUpdateCommunity={handleUpdateCommunity}
              />
            }
            {activeForm == 'scrap' && <ScrapForm githubUser={githubUser} />}
            {activeForm == 'testimonial' && <TestimonialForm githubUser={githubUser} />}
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox
            title={communities.length > 1 ? 'Comunidades' : 'Comunidade'}
            arrayList={communities} link="/communities" />

          <ProfileRelationsBox
            title="Seguindo"
            arrayList={following} link="/photos" />

          <ProfileRelationsBox
            title={followers.length > 1 ? 'Seguidores' : 'Seguidor'}
            arrayList={followers} link="/friends" />

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