import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';

export default function MemberForm(props) {
  const BASE_URL = 'http://alurakut.vercel.app/';
  const MINUS_ICON = 'https://www.datocms-assets.com/51589/1626944795-minus.svg';
  const { isMember, memberId, communityId, githubUser, handleUpdateMembers } = props

  function handleCancelBecomeMember(associated) {
    let member = {
      community_id: communityId,
      name: githubUser,
    };
    toast('Botão clicado, aguarde...');
    if (associated) {
      console.log('cancelar');
      member = {
        enabled: false,
      };
    } else if (memberId != null) {
      console.log('habilitar');
      member = {
        enabled: true,
      };
    } else {
      console.log('se tornar membro');
      member = {
        ...member,
        enabled: true,
      };
      createMember(member);
      return;
    }
    updateMember(member)
  }

  function updateMember(member) {
    fetch(`/api/members/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    }).then(async (response) => {
      const result = await response.json();
      const memberRecovered = result.register;
      if (isMember && memberRecovered) {
        toast.success('Você não é mais membro!');
      } else {
        toast.success('Você se tornou um membro!');
      }
      handleUpdateMembers(memberRecovered);
    }).catch(error => console.error(error));
  }

  function createMember(member) {
    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    }).then(async (response) => {
      const result = await response.json();
      const memberRecovered = result.register;

      if (isMember && memberRecovered) {
        toast.success('Você não é mais membro!');
      } else {
        toast.success('Você se tornou um membro!');
      }
      handleUpdateMembers(memberRecovered);
    }).catch(error => console.error(error));
  }

  return <>
    <Toaster />
    {isMember
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
