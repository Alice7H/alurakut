import nookies from 'nookies';

export default function logoutScreen() {
  return <></>
}

export async function getServerSideProps() {
  nookies.destroy(null, 'USER_TOKEN');

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    }
  }
}
