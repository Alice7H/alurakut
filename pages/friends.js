import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import ProfileSideBar from '../src/components/ProfileSideBar';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { useCheckAuth } from '../src/hooks/useCheckAuth';
import { useFollowers } from '../src/hooks/useFollowers';
import MainTable from '../src/components/MainTable';

export default function FriendsScreen(props) {
  const githubUser = props.githubUser;
  const followers = useFollowers(githubUser);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Amigos do(a){githubUser}</h1>
          </Box>
          <Box>
            <MainTable>
              <tbody>
                {
                  followers.map(follower => {
                    return (
                      <tr key={follower.id} >
                        <td style={{ cursor: 'pointer' }}>
                          <a
                            target="_blank"
                            href={follower.link}
                            rel="noopener noreferrer"
                            title="Abrir perfil do github de seu amigo"
                          >
                            <img src={follower.image} alt={follower.title} />
                          </a>
                        </td>
                        <td>
                          <h2 className="table-title">{follower.title}</h2>
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