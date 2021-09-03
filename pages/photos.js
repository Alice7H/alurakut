import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import ProfileSideBar from '../src/components/ProfileSideBar';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { useCheckAuth } from '../src/hooks/useCheckAuth';
import { useFollowing } from '../src/hooks/useFollowing';

export default function PhotosScreen(props) {
  const githubUser = props.githubUser;
  const following = useFollowing(githubUser);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Fotos do(a){githubUser}</h1>
          </Box>
          <Box>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignContent: 'center',
              justifyContent: 'space-around',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
            >
              {
                following.slice(0, 6).map(follow => {
                  return (
                    <div key={follow.id}
                      style={{
                        margin: '5px',
                      }}
                    >
                      <a href={follow.link}
                        target='_blank'
                        rel="noopener noreferrer"
                        title={`Abrir perfil do github de ${follow.title}`}
                      >
                        <img src={follow.image}
                          alt={follow.title}
                          width="150px"
                          height="150px"
                          style={{ borderRadius: '8px' }}
                        />
                      </a>
                    </div>
                  )
                })
              }
            </div>
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