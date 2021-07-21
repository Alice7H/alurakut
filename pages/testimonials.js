import { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import ProfileSideBar from '../src/components/ProfileSideBar';
import { TestimonialBox } from '../src/components/Testimonial';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { useCheckAuth } from '../src/hooks/useCheckAuth';

export default function TestimonialsScreen(props) {
  const githubUser = props.githubUser;
  const [testimonials, setTestimonials] = useState([]);
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;

  function getTestimonials() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
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
    getTestimonials();
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
            <h1 className="title">Bem vindo(a), {githubUser}</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <TestimonialBox
            message={testimonials.length > 1 ? 'Depoimentos' : 'Depoimento'}
            arrayList={testimonials}
          />
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
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

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    },
  }
}