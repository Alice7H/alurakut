import { useState, useEffect } from 'react';

export function useCommunities() {
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    function getCommunities() {
      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          query: `query {
            allCommunities {
              id
              title
              image
              link
              author
            }
          }`
        }),
      }).then(res => res.json())
        .then(async (res) => {
          const communitiesDato = await res.data.allCommunities;
          setCommunities(communitiesDato);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getCommunities();
  }, []);

  return communities;
}