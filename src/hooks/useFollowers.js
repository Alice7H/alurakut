import { useState, useEffect } from 'react';

export function useFollowers(githubUser) {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    function getFollowers() {
      fetch(`https://api.github.com/users/${githubUser}/followers`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Requisição não completada.');
        })
        .then(res => {
          res.map(item => {
            const follower = {
              id: item.id,
              title: item.login,
              image: item.avatar_url,
              link: item.html_url,
            }
            setFollowers(followers => [...followers, follower]);
          })
        }).catch((error) => {
          console.log(error);
        });
    }
    getFollowers();
  }, [])

  return followers;
}