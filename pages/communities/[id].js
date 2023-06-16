import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../../src/components/MainGrid';
import Box from '../../src/components/Box';
import { AlurakutMenu } from '../../src/lib/AluraKutCommons';
import ProfileRelationsBox from '../../src/components/ProfileRelations';
import MainTable from '../../src/components/MainTable';
import { useCheckAuth } from '../../src/hooks/useCheckAuth';
import { useCommunity } from '../../src/hooks/useCommunity';
import { useMembers } from '../../src/hooks/useMembers';
import MemberForm from '../../src/components/Member';

export default function CommunitiesScreen(props) {
  const githubUser = props.githubUser;
  const router = useRouter();
  const { id } = router.query;
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;
  const { community } = useCommunity(id);
  const [isMember, setIsMember] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const { members } = useMembers(id);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [membersEnabled, setMembersEnabled] = useState([]);
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(community.createdAt).toLocaleString('pt-BR', options);

  function getEnabledMembers() {
    const enabledMembers = communityMembers.filter(member => member.enabled === true);
    setMembersEnabled(enabledMembers);
  }

  function getGithubUserInfo(newMember) {
    return fetch(`https://api.github.com/users/${newMember.name}`)
      .then((res) => res.json())
      .then((data) => {
        const customMember = {
          id: newMember.id,
          name: newMember.name,
          communityId: newMember.communityId,
          enabled: newMember.enabled,
          image: data.avatar_url,
          link: data.html_url
        };
        return customMember;
      })
      .catch((error) => console.error(error));
  }

  function handleUpdateMembers(newMember) {
    members.map(member => {
      if (newMember.id === member.id) {
        const noRepeatedMembers = members.filter(m => m.id !== newMember.id)
        setCommunityMembers(noRepeatedMembers);
      }
    });
    getGithubUserInfo(newMember).then(response => {
      setCommunityMembers(prev => [...prev, response]);
    }).catch(error => { console.log('error: ', error) });
    getEnabledMembers();
  }

  useEffect(() => {
    setCommunityMembers(members);
  }, [members])

  useEffect(() => {
    getEnabledMembers();

    communityMembers.map(member => {
      if (member.name === githubUser) {
        setMemberId(member.id);
        if (member.enabled) {
          setIsMember(true);
        } else {
          setIsMember(false);
        }
      }
    })
  }, [communityMembers]);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <Box as="aside">
            <img src={community.image} alt={community.title} style={{ borderRadius: '8px' }} />
            <h2 className="boxLink">{community.title}</h2>
            <p>({membersEnabled.length} membros)</p>
            <hr />
            {
              community.author !== githubUser
              && <MemberForm
                githubUser={githubUser}
                isMember={isMember}
                memberId={memberId}
                communityId={id}
                handleUpdateMembers={handleUpdateMembers}
              />
            }
          </Box>
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1>{community.title}</h1>
            <NavRedirectRouter>
              <a href="/" className="first" alt="Início">Início</a> &gt; <a href="/communities" alt="Comunidades">Comunidades</a>
            </NavRedirectRouter>
            <MainTable>
              <tbody>
                <tr>
                  <td className="text-right">dono</td>
                  <td className="text-left">{community.author}</td>
                </tr>
                <tr>
                  <td className="text-right">link</td>
                  <td className="text-left">{community.link}</td>
                </tr>
                <tr>
                  <td className="text-right">criado em</td>
                  <td className="text-left">{date}</td>
                </tr>
                <tr>
                  <td className="text-right">categoria</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">idioma</td>
                  <td className="text-left">Português</td>
                </tr>
                <tr>
                  <td className="text-right">tipo</td>
                  <td className="text-left">pública</td>
                </tr>
                <tr>
                  <td className="text-right">local</td>
                  <td className="text-left">Brasil</td>
                </tr>
                <tr>
                  <td className="text-right">membros</td>
                  <td className="text-left">{membersEnabled.length}</td>
                </tr>
              </tbody>
            </MainTable>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox
            title={membersEnabled.length > 1 ? 'Membros' : 'Membro'}
            arrayList={membersEnabled} />
        </div>
      </MainGrid>
    </>
  )
}

const NavRedirectRouter = styled.nav`
  margin: 20px 0;
  a {
    text-decoration: none;
    color: var(--textTertiaryColor);
  }
  .first {
    color: var(--colorPrimary);
  }
`

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
    props: { githubUser },
  }
}