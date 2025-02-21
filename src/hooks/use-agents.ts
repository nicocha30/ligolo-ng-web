import { LigoloAgentList } from "@/types/agents.ts";
import { useApi } from "@/hooks/useApi.ts";

export default function useAgents() {
  const { swr } = useApi();
  const { data, mutate, isLoading } = swr<LigoloAgentList>("agents");

  return { agents: data, loading: isLoading, mutate };
}
