import { AlurakutProfileSidebarMenuDefault } from '../../lib/AluraKutCommons';
import Box from '../Box';

export default function ProfileSideBar(props) {
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
