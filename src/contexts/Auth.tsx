import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SessionParseFailedError } from "@/errors/login.ts";
import { UnknownHttpError } from "@/errors";
import ErrorContext from "@/contexts/Error.tsx";
import { useApi } from "@/hooks/useApi.ts";

interface IAuthContext {
  session: {
    apiUrl: string;
    authToken: string;
  } | null;
  logOut: () => void;
  login: (apiUrl: string, username: string, password: string) => Promise<void>;
}

const storedSession = localStorage.getItem("session") ?? null;
const defaultAuthContext: IAuthContext = {
  session: null,
  logOut: () => undefined,
  login: async () => undefined,
};

export const AuthContext = createContext<IAuthContext>(defaultAuthContext);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<IAuthContext["session"]>(null);
  const { setError } = useContext(ErrorContext);
  const { post } = useApi();

  const logOut = useCallback(() => {
    sessionStorage.removeItem("session");
  }, []);

  useEffect(() => {
    if (!storedSession) return;
    try {
      const sessionData = JSON.parse(storedSession);
      // TODO zod validation instead of cast
      setSession(sessionData as IAuthContext["session"]);
    } catch (e) {
      setError(new SessionParseFailedError("Unable to parse session data"));
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!session) return;

      try {
        // TODO use API request helper
        const response = await fetch(`${session.apiUrl}/ping`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: session.authToken,
          },
        });

        if ((await response.json()).message === "pong") return;

        logOut();
      } catch (error) {
        setError(new SessionParseFailedError("Unable to parse session data"));
      }
    })();
  }, [session?.apiUrl]);

  const login = async (apiUrl: string, username: string, password: string) => {
    try {
      const response = await post("auth", { username, password });
      // TODO validation schema
      const newSession = {
        apiUrl,
        authToken: response.token,
      };

      setSession(newSession);
      sessionStorage.setItem("session", JSON.stringify(newSession));
    } catch (error) {
      throw UnknownHttpError.fromError(error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
