import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";
import { buildErrorMessage } from "../api/response";
import { useAuthStore } from "../store/authStore";

const AuthBootstrapContext = createContext({
  isBootstrapping: true,
  error: null,
});

export const useAuthBootstrap = () => useContext(AuthBootstrapContext);

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const data = await authApi.getCurrentUser();
        if (!isMounted) {
          return;
        }
        if (data) {
          const userPayload = data?.user ?? data;
          const accessToken = data?.accessToken;
          const refreshToken = data?.refreshToken;
          setAuth({ user: userPayload, accessToken, refreshToken });
        } else {
          setInitialized(true);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(buildErrorMessage(err));
        setInitialized(true);
      }
    };

    if (!isInitialized) {
      bootstrap();
    }

    return () => {
      isMounted = false;
    };
  }, [isInitialized, setAuth, setInitialized]);

  const value = {
    isBootstrapping: !isInitialized,
    error,
  };

  return (
    <AuthBootstrapContext.Provider value={value}>
      {children}
    </AuthBootstrapContext.Provider>
  );
};
