import React, { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import CommunityForm from '../src/components/Community';
import { ScrapForm, ScrapBox } from '../src/components/Scrap';
import { TestimonialForm, TestimonialBox } from '../src/components/Testimonial';
import ProfileRelationsBox from '../src/components/ProfileRelations';
import { FormOptionsButton } from '../src/components/FormOptionsButton';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AluraKutCommons';
import 'suneditor/dist/css/suneditor.min.css';

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
  const [following, setFollowing] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeForm, setActiveForm] = useState('community');

  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN;

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
        'Authorization': `Bearer ${token}`,
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
      });
  }

  function getScraps() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `query {
          allScraps(filter: {receiveUser: {eq: ${githubUser}}})  {
            id
            message
            author
            receiveUser
            image
            createdAt
          }
        }`
      }),
    }).then(res => res.json())
      .then((res) => {
        const scrapDato = res.data.allScraps;
        setScraps(scrapDato);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getTestimonials() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `query {
          allTestimonials(filter: {receiveUser: {eq: ${githubUser}}})  {
            id
            message(markdown: true)
            author
            receiveUser
            createdAt
          }
        }`
      }),
    }).then(res => res.json())
      .then((res) => {
        const testimonialDato = res.data.allTestimonials;
        setTestimonials(testimonialDato);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getFollowers();
    getFollowing();
    getCommunities();
    getScraps();
    getTestimonials();
  }, []);

  function handleUpdateCommunity(communities) {
    setCommunities(communities);
    // include toast
  }

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
          <ScrapBox
            message={scraps.length > 1 ? 'Recados' : 'Recado'}
            arrayList={scraps}
          />

          <TestimonialBox
            message={testimonials.length > 1 ? 'Depoimentos' : 'Depoimento'}
            arrayList={testimonials}
          />

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
