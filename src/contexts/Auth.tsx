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
import { Session, sessionSchema } from "@/schemas/session.ts";
import { validate } from "@/schemas";
import { authResponseSchema } from "@/schemas/api/auth.ts";
import { pingResponseSchema } from "@/schemas/api/ping.ts";

const defaultApiUrl = import.meta.env["VITE_DEFAULT_API_URL"];

interface IAuthContext {
  session: Session | null;
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
  const { post, get } = useApi(defaultApiUrl);

  const logOut = useCallback(() => {
    sessionStorage.removeItem("session");
  }, []);

  useEffect(() => {
    if (!storedSession) return;
    try {
      const sessionData = JSON.parse(storedSession);
      const session: Session = validate(JSON.parse(sessionData), sessionSchema);

      setSession(session);
    } catch (error) {
      setError(new SessionParseFailedError("Unable to parse session data"));
      sessionStorage.removeItem("session");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!session) return;

      try {
        const { message } = validate(await get("ping"), pingResponseSchema);
        if (message === "pong") return;

        logOut();
        // TODO toast
      } catch (error) {
        setError(new SessionParseFailedError("Unable to parse session data"));
        console.error(error);
      }
    })();
  }, [session]);

  const login = async (apiUrl: string, username: string, password: string) => {
    try {
      const response = validate(
        await post("auth", { username, password }),
        authResponseSchema,
      );

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
