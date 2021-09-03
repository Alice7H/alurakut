import { useState, useEffect } from 'react';

export function useFollowing(githubUser) {
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    function getFollowing() {
      fetch(`https://api.github.com/users/${githubUser}/following`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Requisição não completada.');
        })
        .then(res => {
          res.map(item => {
            const follow = {
              id: item.id,
              title: item.login,
              image: item.avatar_url,
              link: item.html_url,
            }
            setFollowing(following => [...following, follow]);
          })
        }).catch((error) => {
          console.log(error);
        });
    }
    getFollowing();
  }, [])

  return following;
}