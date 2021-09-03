import { useState, useEffect } from 'react';

export function useTestimonials(githubUser) {
  const [testimonials, setTestimonials] = useState([]);
  const token = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN_READER;

  function getTestimonials() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        query: `query {
          allTestimonials(filter: {receiveUser: {eq: ${githubUser}}})  {
            id
            message(markdown: true)
            author
            receiveUser
            createdAt
          }
        }`
      }),
    }).then(res => res.json())
      .then((res) => {
        const testimonialDato = res.data.allTestimonials;
        setTestimonials(testimonialDato);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getTestimonials();
  }, []);

  return testimonials;
}