import { useApi } from "@/hooks/useApi.ts";
import { LigoloListeners } from "@/types/listeners.ts";

export default function useListeners() {
  const { swr } = useApi();
  const { data, mutate, isLoading } = swr<LigoloListeners>("listeners");

  return { listeners: data, loading: isLoading, mutate };
}
