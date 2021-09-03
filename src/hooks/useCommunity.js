import { useState, useEffect } from 'react';

export function useCommunity(id) {
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;
  const [community, setCommunity] = useState({});

  useEffect(() => {
    function getCommunity() {
      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          query: `query {
            community(filter: {id: {eq: ${id}}}) {
              id
              image
              link
              title
              author
              createdAt
            }
          }`
        }),
      }).then(res => res.json())
        .then((res) => {
          const communityDato = res.data.community;
          setCommunity(communityDato);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getCommunity();
  }, []);

  return { community };
}