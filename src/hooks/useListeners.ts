import { LigoloListeners } from "@/types/listeners.ts";
import { useApi } from "@/hooks/useApi.ts";
import { KeyedMutator } from "swr";

export default function useListeners(): {
  listeners: LigoloListeners;
  loading: boolean;
  mutate: KeyedMutator<LigoloListeners>;
} {
  const { swr } = useApi();
  const { data, mutate, isLoading } = swr("listeners");

  return { listeners: data, loading: isLoading, mutate };
}
