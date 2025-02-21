import { useCallback, useContext, useMemo } from "react";
import useSWR from "swr";
import { AuthContext } from "@/contexts/Auth.tsx";

const defaultApiUrl = import.meta.env["VITE_DEFAULT_API_URL"];

export const useApi = () => {
  const { session } = useContext(AuthContext);
  const apiUrl = useMemo(() => session?.apiUrl || defaultApiUrl, [session]);

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
    async (endpoint: string, body: Record<string, unknown>) => {
      if (!session) return;

      const authInjection = session
        ? { Authorization: session.authToken }
        : null;

      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authInjection },
        body: JSON.stringify(body),
      });

      return await response.json();
    },
    [session],
  );

  const get = useCallback(
    async (endpoint: string) => {
      // TODO implement query params
      if (!session) return;

      const authInjection = session
        ? { Authorization: session.authToken }
        : null;

      const response = await fetch(`${session.apiUrl}/${endpoint}`, {
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
