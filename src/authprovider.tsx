import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthProviderContextType {
  api: string;
  authToken: string;
  errorText: string;
  loginApi: (
    apiUrl: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logOut: () => void;
  authenticated: boolean;
}

const AuthContext = createContext<AuthProviderContextType | null>(null);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [errorText, setErrorText] = useState("");
  const [api, setApi] = useState(
    localStorage.getItem("apiUrl") || "http://127.0.0.1:8080",
  );
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || "",
  );
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  const loginApi = async (
    apiUrl: string,
    username: string,
    password: string,
  ) => {
    return fetch(`${apiUrl}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response: Response) => response.json())
      .then((jsonData) => {
        if (jsonData.token) {
          setAuthToken(jsonData.token);
          setApi(apiUrl);
          localStorage.setItem("apiUrl", apiUrl);
          localStorage.setItem("authToken", jsonData.token);
          window.location.reload();
          return;
        }
        setErrorText("Unable to login, please check your credentials.");
      })
      .catch((response) => {
        setErrorText(response.message);
      });
  };

  useEffect(() => {
    fetch(`${api}/ping`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`,
      },
    })
      .then((response: Response) => response.json())
      .then((result) => {
        setAuthenticated(result.message == "pong");
      });
  }, [api]);

  const logOut = () => {
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ api, authToken, authenticated, errorText, loginApi, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
