import { useCallback, useContext, useMemo } from "react";
import useSWR from "swr";
import { AuthContext } from "@/contexts/Auth.tsx";
import { UnknownHttpError } from "@/errors";
import { SWRResponse } from "swr/dist/_internal/types";

interface IApiOptions {
  apiUrl: string;
}

export const useApi = (_apiUrl?: string) => {
  const { session } = useContext(AuthContext);
  const apiUrl = useMemo(() => _apiUrl || session?.apiUrl, [session, _apiUrl]);

  const swrCallback = useCallback(
    async (endpoint: string) => {
      if (!session)
        return console.info(
          `[SWR:${endpoint}] Skipped because no session exists`,
        );

      const res = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: session.authToken,
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

      const jsonResp = await response.json();

      if (jsonResp.error) throw UnknownHttpError.fromResponse(jsonResp);

      return jsonResp;
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

      const jsonResp = await response.json();

      if (jsonResp.error) throw UnknownHttpError.fromResponse(jsonResp);

      return jsonResp;
    },
    [session],
  );

  const del = useCallback(
    async (
      endpoint: string,
      body?: Record<string, unknown>,
      opt?: IApiOptions,
    ) => {
      const authInjection = session
        ? { Authorization: session.authToken }
        : null;

      const response = await fetch(`${opt?.apiUrl ?? apiUrl}/${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authInjection,
        },
        body: JSON.stringify(body),
      });

      const jsonResp = await response.json();

      if (jsonResp.error) throw UnknownHttpError.fromResponse(jsonResp);

      return jsonResp;
    },
    [session],
  );

  const swr = useCallback(
    <Data>(endpoint: string): SWRResponse<Data> => {
      return useSWR(
        `${session?.apiUrl}/${endpoint}`,
        (url) => swrCallback(url),
        { keepPreviousData: true },
      );
    },
    [session],
  );

  return { post, get, swr, del };
};
