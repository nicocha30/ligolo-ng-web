import {useCallback} from "react";
import DefaultLayout from "@/layouts/default";
import {
    Button,
    Chip,
    CircularProgress,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import {ChevronsLeftRightEllipsis, ListCollapse, NetworkIcon, Power, PowerOff} from "lucide-react";
import {LigoloAgentList} from "@/types/agents.ts";
import {useAuth} from "@/authprovider.tsx";
import useAgents from "@/hooks/use-agents.ts";
import useInterfaces from "@/hooks/use-interfaces.ts";
import {InterfaceCreationModal} from "@/components/modals.tsx";


export default function AgentPage() {

    const auth = useAuth();

    const {agents, loading, mutate} = useAgents();
    const {interfaces} = useInterfaces();


    const loadingState = loading ? "loading" : "idle";

    const onTunnelStop = useCallback((id: keyof LigoloAgentList) => async () => {
        await fetch(`${auth?.api}/tunnel/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json", "Authorization": `${auth?.authToken}`},
        })
        // TODO check API response
        await mutate()
    }, [mutate])

    const onTunnelStart = useCallback((id: keyof LigoloAgentList, iface: string) => async () => {
        await fetch(`${auth?.api}/tunnel/${id}`, {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": `${auth?.authToken}`},
            body: JSON.stringify(({
                    interface: iface
                })
            )
        })
        // TODO check API response
        await mutate()
    }, [mutate])

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    return (
        <DefaultLayout>
            <InterfaceCreationModal isOpen={isOpen} onOpenChange={onOpenChange}
                                    mutate={mutate}></InterfaceCreationModal>

            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <Table aria-label="Table with agent list">
                    <TableHeader>
                        <TableColumn>#</TableColumn>
                        <TableColumn className="uppercase">Name</TableColumn>
                        <TableColumn className="uppercase">Interface</TableColumn>
                        <TableColumn className="uppercase">Status</TableColumn>
                        <TableColumn className="uppercase">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody
                        loadingState={loadingState}
                        loadingContent={
                            <CircularProgress aria-label="Loading..." size="sm"/>
                        }
                        emptyContent={"No agents connected."}
                    >
                        <>
                            {agents ? Object.entries(agents).map(([row, agent]) => (
                                <TableRow key={row}>
                                    <TableCell>{row}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm">{agent.Name}</p>
                                            <p className="text-bold text-sm text-default-400">{agent.RemoteAddr} - {agent.SessionID}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-bold text-sm">{agent.Interface}</p>

                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip className="capitalize" color={agent.Running ? "success" : "danger"}
                                              size="sm"
                                              variant="flat">
                                            {agent.Running ? "Tunneling" : "Stopped"}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2">
                                            <Button isIconOnly>
                                                <Tooltip content={
                                                    <div className="px-1 py-2">
                                                        <div className="text-small font-bold">Interface information
                                                        </div>
                                                        {agent.Network.map((network) => (
                                                            <div
                                                                className={"text-tiny"}>{network.Name} : {network.Addresses ? network.Addresses.map((net) =>
                                                                <Chip>{net}</Chip>) : null}</div>
                                                        ))}
                                                    </div>
                                                }>
                                                    <ListCollapse size={20}/>
                                                </Tooltip>
                                            </Button>

                                            {agent.Running ?
                                                <Button isIconOnly onPress={onTunnelStop(row)} color={"danger"}>
                                                    <Tooltip content={"Stop tunneling"} color={"danger"}>
                                                        <PowerOff size={20}/>
                                                    </Tooltip>
                                                </Button>

                                                :
                                                <>
                                                    <Dropdown>
                                                        <DropdownTrigger>

                                                            <Button isIconOnly color={"success"}>
                                                                <Tooltip content={"Setup tunneling"} color={"success"}>
                                                                    <Power size={20}/>
                                                                </Tooltip>
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Static Actions">
                                                            <DropdownItem key="new" startContent={<NetworkIcon
                                                                className={iconClasses}/>} showDivider
                                                                          description={"Create a random interface then start the tunnel"}
                                                                          onPress={onOpen}>Start with a new
                                                                interface</DropdownItem>
                                                            <>
                                                                {interfaces ? Object.entries(interfaces).map(([ifName]) => (
                                                                    <DropdownItem key={ifName} startContent={
                                                                        <ChevronsLeftRightEllipsis
                                                                            className={iconClasses}/>}
                                                                                  description={"Use the following interface"}
                                                                                  onPress={onTunnelStart(row, ifName)}>Bind
                                                                        to {ifName}</DropdownItem>
                                                                )) : null}
                                                            </>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </>

                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : null}
                        </>
                    </TableBody>
                </Table></section>
        </DefaultLayout>
    );
}

