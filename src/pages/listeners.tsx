import DefaultLayout from "@/layouts/default";
import {
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure,
} from "@heroui/react";
import {CircleX, PlusIcon} from "lucide-react";
import {ListenerCreationModal} from "@/components/modals.tsx";
import {useCallback} from "react";
import useListeners from "@/hooks/use-listeners.ts";
import {useAuth} from "@/authprovider.tsx";


export default function IndexPage() {
    const auth = useAuth();
    const {listeners, loading, mutate} = useListeners();

    const onListenerDelete = useCallback((agentId: number, listenerId: number) => async () => {
        await fetch(`${auth?.api}/listeners`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json", "Authorization": `${auth?.authToken}`},
            body: JSON.stringify(({
                    agentId: agentId,
                    listenerId: listenerId
                })
            )
        })        // TODO check API response
        await mutate()
    }, [mutate])

    const loadingState = loading ? "loading" : "idle";
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <DefaultLayout>
            <ListenerCreationModal isOpen={isOpen} onOpenChange={onOpenChange} mutate={mutate}
                                   agentId={undefined}></ListenerCreationModal>

            <section className="flex flex-col gap-4 md:py-10">
                <div className="flex justify-between gap-3 items-end">

                    <Button color="primary" endContent={<PlusIcon/>} onPress={onOpen}>
                        Add New
                    </Button>
                </div>
                <Table aria-label="Listener list">
                    <TableHeader>
                        <TableColumn>#</TableColumn>
                        <TableColumn className="uppercase">Agent</TableColumn>
                        <TableColumn className="uppercase">Network</TableColumn>
                        <TableColumn className="uppercase">Listener Address</TableColumn>
                        <TableColumn className="uppercase">Redirect Address</TableColumn>
                        <TableColumn className={"uppercase"}>Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                        emptyContent={"No active listeners."}
                        loadingState={loadingState}
                        loadingContent={
                            <CircularProgress aria-label="Loading..." size="sm"/>
                        }
                    >
                        <>
                            {listeners ? Object.entries(listeners).map(([row, listener]) => (
                                <TableRow key={row}>
                                    <TableCell>{listener.ListenerID}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm">{listener.Agent}</p>
                                            <p className="text-bold text-sm text-default-400">{listener.RemoteAddr}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{listener.Network}</TableCell>
                                    <TableCell>{listener.ListenerAddr}</TableCell>
                                    <TableCell>{listener.RedirectAddr}</TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2">

                                            <Tooltip content="Remove listener" color={"danger"}>
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                                      onClick={onListenerDelete(listener.AgentID, listener.ListenerID)}>
                                                  <CircleX/>
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : null}
                        </>
                    </TableBody>
                </Table>
            </section>
        </DefaultLayout>
    );
}

