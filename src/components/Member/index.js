import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';

export default function MemberForm(props) {
  const BASE_URL = 'http://alurakut.vercel.app/';
  const MINUS_ICON = 'https://www.datocms-assets.com/51589/1626944795-minus.svg';

  function handleCancelBecomeMember(cancel) {
    let member = {};
    toast('Botão clicado, aguarde...');
    if (!cancel && props.memberId === null) {
      console.log('se tornar membro');
      member = {
        communityId: props.communityId,
        name: props.githubUser,
        enabled: true,
      };
    } else if (cancel) {
      console.log('cancelar');
      member = {
        id: props.memberId,
        communityId: props.communityId,
        name: props.githubUser,
        enabled: false,
      };
    } else if (props.memberId != null && !cancel) {
      console.log('habilitar');
      member = {
        id: props.memberId,
        communityId: props.communityId,
        name: props.githubUser,
        enabled: true,
      };
    }

    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    }).then(async (response) => {
      const result = await response.json();
      const member = result.register;
      if (cancel && member) {
        toast.success('Você não é mais membro!');
      } else if (member) {
        toast.success('Você se tornou um membro!');
      }
      props.handleUpdateMembers(member);
    }).catch(error => console.error(error));
  }

  return <>
    <Toaster />
    {props.isMember
      ?
      <Button onClick={() => handleCancelBecomeMember(true)}>
        <img src={MINUS_ICON} />
        Sair da comunidade
      </Button>
      :
      <Button onClick={() => handleCancelBecomeMember(false)}>
        <img src={`${BASE_URL}/icons/plus.svg`} />
        Participar da comunidade
      </Button>
    }
  </>
}

const Button = styled.button`
  display: flex;
  color: #2E7BB4 !important;
  background-color: transparent !important;

  img {
    margin-top: 5px;
  }
`
