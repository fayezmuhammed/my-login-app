import { GetServerSideProps } from "next";

export default function Home() {
  return null; // This component won't render since we redirect on the server
}

// Redirect to the login page on the server side
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/login",
      permanent: false, // Set to true for permanent redirection (HTTP 308)
    },
  };
};
