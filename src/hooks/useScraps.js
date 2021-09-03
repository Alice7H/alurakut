import { useState, useEffect } from 'react';

export function useScraps(githubUser) {
  const [scraps, setScraps] = useState([]);
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;

  function getScraps() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        query: `query {
          allScraps(filter: {receiveUser: {eq: ${githubUser}}})  {
            id
            message
            author
            receiveUser
            image
            createdAt
          }
        }`
      }),
    }).then(res => res.json())
      .then((res) => {
        const scrapDato = res.data.allScraps;
        setScraps(scrapDato);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getScraps();
  }, []);

  return scraps;
}