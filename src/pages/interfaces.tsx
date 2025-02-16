import DefaultLayout from "@/layouts/default";
import {
    Button,
    Chip,
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
import {CheckIcon, CircleX, EthernetPort, HourglassIcon, PlusIcon} from "lucide-react";
import {useCallback, useState} from "react";
import useInterfaces from "@/hooks/use-interfaces.ts";
import {useAuth} from "@/authprovider.tsx";
import {InterfaceCreationModal, RouteCreationModal} from "@/components/modals.tsx";


export default function IndexPage() {
    const {
        interfaces,
        loading,
        mutate
    } = useInterfaces();

    const auth = useAuth();


    const onRouteDelete = useCallback((iface: string, route: string) => async () => {
        await fetch(`${auth?.api}/routes`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json", "Authorization": `${auth?.authToken}`},
            body: JSON.stringify(({
                    interface: iface,
                    route: route
                })
            )
        })        // TODO check API response
        await mutate()
    }, [mutate])

    const onInterfaceDelete = useCallback((iface: string) => async () => {
        await fetch(`${auth?.api}/interfaces`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json", "Authorization": `${auth?.authToken}`},
            body: JSON.stringify(({
                    interface: iface,
                })
            )
        })        // TODO check API response
        await mutate()
    }, [mutate])


    const loadingState = loading || Object.keys(interfaces || []).length === 0 ? "loading" : "idle";
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const {isOpen: isInterfaceOpen, onOpen: onInterfaceOpen, onOpenChange: onInterfaceOpenChange} = useDisclosure();

    const [selectedInterface, setSelectedInterface] = useState("");

    return (
        <DefaultLayout>
            <InterfaceCreationModal isOpen={isInterfaceOpen} onOpenChange={onInterfaceOpenChange}
                                    mutate={mutate}></InterfaceCreationModal>
            <RouteCreationModal isOpen={isOpen} onOpenChange={onOpenChange}
                                selectedInterface={selectedInterface} mutate={mutate}></RouteCreationModal>

            <section className="flex flex-col gap-4 md:py-10">
                <div className="flex justify-between gap-3 items-end">

                    <Button color="primary" endContent={<PlusIcon/>} onPress={onInterfaceOpen}>
                        Add New
                    </Button>
                </div>
                <Table aria-label="Interface list">
                    <TableHeader>
                        <TableColumn className="uppercase">Interface Name</TableColumn>
                        <TableColumn className="uppercase">State</TableColumn>
                        <TableColumn className="uppercase">Routes</TableColumn>
                        <TableColumn className="uppercase">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody
                        loadingState={loadingState}
                        loadingContent={
                            <CircularProgress aria-label="Loading..." size="sm"/>
                        }
                    >
                        <>
                            {interfaces ? Object.entries(interfaces).map(([row, iface]) => (
                                <TableRow key={row}>
                                    <TableCell>{row}</TableCell>
                                    <TableCell>{iface.Active ? (
                                            <Chip color="success" startContent={<CheckIcon size={18}/>} variant="faded">
                                                <Tooltip content="Active interfaces are already present on the system"
                                                         color={"success"}>Active
                                                </Tooltip>
                                            </Chip>) :
                                        <Chip color="warning" startContent={<HourglassIcon size={18}/>}
                                              variant="faded">
                                            <Tooltip content="Pending interfaces will be created on tunnel start"
                                                     color={"warning"}>Pending
                                            </Tooltip>
                                        </Chip>}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {iface.Routes ? iface.Routes.map((route, idx) => (
                                                <Chip key={idx} color={route.Active ? "primary" : "warning"}
                                                      variant="flat"
                                                      onClose={onRouteDelete(row, route.Destination)}>{route.Destination}</Chip>
                                            )) : null}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2">
                                            <Tooltip content="Add new route">
                                                <span
                                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                    onClick={() => {
                                                        setSelectedInterface(row);
                                                        onOpen()
                                                    }}>
                                                  <EthernetPort/>
                                                </span>
                                            </Tooltip>
                                            <Tooltip content="Remove interface" color={"danger"}>
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                                      onClick={onInterfaceDelete(row)}>
                                                  <CircleX/>
                                                </span>
                                            </Tooltip>
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

