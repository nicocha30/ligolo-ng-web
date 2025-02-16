import {useAuth} from "@/authprovider.tsx";
import useSWR, {MutatorCallback, MutatorOptions} from "swr";
import {LigoloListeners, Listener} from "@/types/listeners.ts";
import {useEffect, useState} from "react";
import {fetchWithToken} from "@/hooks/fetcher.ts";

export default function useListeners(): {
    mutate: <MutationData = Listener[]>(data?: (Promise<Listener[] | undefined> | MutatorCallback<Listener[]> | Listener[]), opts?: (boolean | MutatorOptions<Listener[], MutationData>)) => Promise<Listener[] | MutationData | undefined>;
    loading: boolean
    listeners: Listener[]
} {
    const auth = useAuth();
    const [listeners, setListeners] = useState<LigoloListeners>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {
        data, mutate, isLoading
    } = useSWR<LigoloListeners>(`${auth?.api}/listeners`, url => fetchWithToken(url, auth?.authToken), {
        keepPreviousData: true,
    });

    useEffect(() => {
        if (data) {
            setListeners(data);
        }
        setLoading(isLoading);
    }, [data, isLoading]);
    return {listeners, loading, mutate}
}