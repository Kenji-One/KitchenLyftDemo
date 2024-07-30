import { signOut } from "next-auth/react";

const useReloadSession = () => {
  const reloadSession = () => {
    signOut({ redirect: false }).then(() => {
      window.location.reload();
    });
  };

  return { reloadSession };
};

export default useReloadSession;
