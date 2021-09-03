import nookies from 'nookies';

export default function logoutScreen() {
  return <></>
}

export async function getServerSideProps(ctx) {
  nookies.destroy(ctx, 'USER_TOKEN');

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    }
  }
}
