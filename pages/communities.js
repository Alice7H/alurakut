import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import ProfileSideBar from '../src/components/ProfileSideBar';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { useCheckAuth } from '../src/hooks/useCheckAuth';
import { useCommunities } from '../src/hooks/useCommunities';
import MainTable from '../src/components/MainTable';

export default function CommunitiesScreen(props) {
  const githubUser = props.githubUser;
  const communities = useCommunities();
  const router = useRouter();
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function countMembers(id) {
      const res = await fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          query: `query {
              allMembers(filter: {
                communityId: {eq: "${id}"},
                enabled: {eq: true },
              }) {
                communityId
              }
            }`
        }),
      });
      const data = await res.json();
      const membersDato = await data.data.allMembers;
      if (membersDato) {
        return membersDato;
      }
      return 0;
    }

    async function loadMembersPerCommunity() {
      const promises = communities.map(community => countMembers(community.id));
      setMembers(await Promise.all(promises));
    }

    loadMembersPerCommunity()

  }, [communities])

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Comunidades</h1>
          </Box>

          <Box>
            <MainTable>
              <tbody>
                {
                  communities && communities.map((community, index) => {
                    return (
                      <tr
                        style={{ cursor: 'pointer' }}
                        key={community.id}
                        onClick={() => {
                          router.push({
                            pathname: '/communities/[id]',
                            query: { id: community.id },
                          })
                        }}
                      >
                        <td>
                          <img src={community.image} alt={community.title} />
                        </td>
                        <td>
                          <h2 className="table-title">{community.title}</h2>
                          <p className="table-members">
                            {members[index]?.length}
                            {members[index]?.length > 1 ? ' membros' : ' membro'}
                          </p>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </MainTable>
          </Box>
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