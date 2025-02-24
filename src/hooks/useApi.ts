import { useCallback, useContext, useMemo } from "react";
import useSWR from "swr";
import { AuthContext } from "@/contexts/Auth.tsx";

interface IApiOptions {
  apiUrl: string;
}

export const useApi = (_apiUrl?: string) => {
  const { session } = useContext(AuthContext);
  const apiUrl = useMemo(() => _apiUrl || session?.apiUrl, [session, _apiUrl]);

  const swrCallback = useCallback(
    async (url: string) => {
      if (!session) return;

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.authToken}`,
        },
      });

      return await res.json();
    },
    [session],
  );

  const post = useCallback(
    async (
      endpoint: string,
      body: Record<string, unknown>,
      opt?: IApiOptions,
    ) => {
      const authInjection = session
        ? { Authorization: session.authToken }
        : null;

      const response = await fetch(`${opt?.apiUrl ?? apiUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authInjection },
        body: JSON.stringify(body),
      });

      return await response.json();
    },
    [session],
  );

  const get = useCallback(
    async (endpoint: string, opt?: IApiOptions) => {
      // TODO implement query params
      const authInjection = session
        ? { Authorization: session.authToken }
        : null;

      const response = await fetch(`${opt?.apiUrl ?? apiUrl}/${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...authInjection,
        },
      });

      return await response.json();
    },
    [session],
  );

  const swr = useCallback(
    <Data>(endpoint: string) => {
      return useSWR<Data>(
        `${session?.apiUrl}/${endpoint}`,
        (url) => swrCallback(url),
        { keepPreviousData: true },
      );
    },
    [session],
  );

  return { post, get, swr };
};
