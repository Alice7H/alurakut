export default function CommunityForm(props) {

  function handleCreateCommunity(event) {
    event.preventDefault();
    const dataForm = new FormData(event.target);

    const community = {
      title: dataForm.get('title'),
      image: dataForm.get('image'),
      link: dataForm.get('link'),
      author: props.githubUser,
    }

    fetch('/api/communities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(community),
    }).then(async (response) => {
      const result = await response.json();
      const community = result.registerCreated;
      const updatedCommunities = [...props.communities, community];
      event.target.reset();

      props.handleUpdateCommunity(updatedCommunities);
    }).catch(error => console.error(error));

  }

  return (
    <form onSubmit={handleCreateCommunity}>
      <div>
        <input
          placeholder="Qual vai ser o nome da sua comunidade?"
          name="title"
          type="text"
          aria-label="Qual vai ser o nome da sua comunidade?"
          required
        />
      </div>
      <div>
        <input
          placeholder="Adicione uma url para usar de capa"
          name="image"
          type="text"
          aria-label="Adicione uma url para usar de capa"
        />
      </div>
      <div>
        <input
          placeholder="Adicione a url da sua comunidade"
          name="link"
          type="text"
          aria-label="Adicione a url da sua comunidade"
          required
        />
      </div>
      <button>
        Criar comunidade
      </button>
    </form>
  )
}