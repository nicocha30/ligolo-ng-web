import { LigoloListeners } from "@/types/listeners.ts";
import { useApi } from "@/hooks/useApi.ts";

export default function useListeners() {
  const { swr } = useApi();
  const { data, mutate, isLoading } = swr<LigoloListeners>("agents");

  return { listeners: data, loading: isLoading, mutate };
}
