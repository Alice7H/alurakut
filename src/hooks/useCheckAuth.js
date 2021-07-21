export async function useCheckAuth(token) {
  const { isAuthenticated } = await fetch(
    process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    {
      headers: {
        Authorization: token,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  return isAuthenticated;
}