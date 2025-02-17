import { useAuth } from "@/authprovider.tsx";
import useSWR, { MutatorCallback, MutatorOptions } from "swr";
import { useEffect, useState } from "react";
import { LigoloAgentList } from "@/types/agents.ts";
import { fetchWithToken } from "@/hooks/fetcher.ts";

export default function useAgents(): {
  mutate: <MutationData = LigoloAgentList>(
    data?:
      | Promise<LigoloAgentList | undefined>
      | MutatorCallback<LigoloAgentList>
      | LigoloAgentList,
    opts?: boolean | MutatorOptions<LigoloAgentList, MutationData>,
  ) => Promise<LigoloAgentList | MutationData | undefined>;
  loading: boolean;
  agents: LigoloAgentList | undefined;
} {
  const auth = useAuth();
  const [agents, setAgents] = useState<LigoloAgentList>();
  const [loading, setLoading] = useState<boolean>(true);
  const { data, mutate, isLoading } = useSWR<LigoloAgentList>(
    `${auth?.api}/agents`,
    (url) => fetchWithToken(url, auth?.authToken),
    {
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (data) {
      setAgents(data);
    }
    setLoading(isLoading);
  }, [data, isLoading]);
  return { agents, loading, mutate };
}
