import { useAuth } from "@/authprovider.tsx";
import useSWR, { MutatorCallback, MutatorOptions } from "swr";
import { useEffect, useState } from "react";
import { LigoloInterfaces } from "@/types/interfaces.ts";
import { fetchWithToken } from "@/hooks/fetcher.ts";

export default function useInterfaces(): {
  mutate: <MutationData = LigoloInterfaces>(
    data?:
      | Promise<LigoloInterfaces | undefined>
      | MutatorCallback<LigoloInterfaces>
      | LigoloInterfaces,
    opts?: boolean | MutatorOptions<LigoloInterfaces, MutationData>,
  ) => Promise<LigoloInterfaces | MutationData | undefined>;
  loading: boolean;
  interfaces: LigoloInterfaces | undefined;
} {
  const auth = useAuth();
  const [interfaces, setInterfaces] = useState<LigoloInterfaces>();
  const [loading, setLoading] = useState<boolean>(true);
  const { data, mutate, isLoading } = useSWR<LigoloInterfaces>(
    `${auth?.api}/interfaces`,
    (url) => fetchWithToken(url, auth?.authToken),
    {
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (data) {
      setInterfaces(data);
    }
    setLoading(isLoading);
  }, [data, isLoading]);
  return { interfaces, loading, mutate };
}
