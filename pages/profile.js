import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import ProfileSideBar from '../src/components/ProfileSideBar';
import ProfileTable from '../src/components/ProfileTable';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { useCheckAuth } from '../src/hooks/useCheckAuth';

export default function ProfileScreen(props) {
  const githubUser = props.githubUser;
  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Perfil do(a) {githubUser}</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">Informações Pessoais</h2>
            <ProfileTable>
              <tbody>
                <tr>
                  <td className="text-right">Relacionamento:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Aniversário:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Idade:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Interesses:</td>
                  <td className="text-left">
                    não informado
                  </td>
                </tr>
                <tr>
                  <td className="text-right">Filhos:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Etnia:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Humor:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Orientação sexual:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Fumo:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Bebo:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Animais de estimação:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Página web:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Github:</td>
                  <td className="text-left">https://github.com/{githubUser}</td>
                </tr>
                <tr>
                  <td className="text-right">Paixões:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Esportes:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Atividades:</td>
                  <td className="text-left">não informado</td>
                </tr>
                <tr>
                  <td className="text-right">Livros:</td>
                  <td className="text-left">não informado</td>
                </tr>
              </tbody>
            </ProfileTable>
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

  const { githubUser } = jwt.decode(token); // token decoded
  return {
    // will be passed to the page component as props
    props: {
      githubUser
    },
  }
}