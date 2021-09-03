import { useState, useEffect } from 'react';

export function useMembers(id) {
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;
  const [members, setMembers] = useState([]);

  useEffect(() => {
    function getGithubUserInfo(membersDato) {
      membersDato.map(memberDato => {
        fetch(`https://api.github.com/users/${memberDato.name}`)
          .then((res) => res.json())
          .then((data) => {
            const customMember = {
              id: memberDato.id,
              name: memberDato.name,
              communityId: memberDato.communityId,
              enabled: memberDato.enabled,
              image: data.avatar_url,
              link: data.html_url
            };
            setMembers(members => [...members, customMember]);
          })
          .catch((error) => console.error(error));
      })
    }

    function getMembers() {
      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          query: `query {
            allMembers(filter: {communityId: {eq: "${id}"}}) {
              id
              name
              communityId
              enabled
              createdAt
            }
          }`
        }),
      }).then(res => res.json())
        .then(async (res) => {
          const membersDato = await res.data.allMembers;
          getGithubUserInfo(membersDato);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getMembers();

  }, [])

  return { members };

}