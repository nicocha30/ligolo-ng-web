import { useCallback, useState } from "react";
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
import { ChevronsLeftRightEllipsis, Cog, ListCollapse, NetworkIcon, Power, PowerOff } from "lucide-react";
import { LigoloAgent, LigoloAgentList } from "@/types/agents.ts";
import useAgents from "@/hooks/useAgents.ts";
import useInterfaces from "@/hooks/useInterfaces.ts";
import { InterfaceCreationModal } from "@/pages/interfaces/modal.tsx";
import { handleApiResponse } from "@/hooks/toast.ts";
import { AutorouteModal } from "@/pages/agents/modal.tsx";
import { useApi } from "@/hooks/useApi.ts";

export default function AgentPage() {
  const { post, del } = useApi();

  const { agents, loading, mutate: mutateAgent } = useAgents();
  const { interfaces, mutate: mutateInterface } = useInterfaces();
  const {
    onOpen: onOpenInterfaceCreationModal,
    isOpen: isInterfaceCreationModalOpen,
    onOpenChange: onInterfaceCreationModalOpenChange
  } = useDisclosure();

  const {
    onOpen: onAutorouteOpen,
    isOpen: isAutorouteModalOpen,
    onOpenChange: onAutorouteModalOpenChange
  } = useDisclosure();

  const [selectedAgent, setSelectedAgent] = useState<keyof LigoloAgentList>(0);

  const loadingState = loading ? "loading" : "idle";

  const onTunnelStop = useCallback(
    (id: string) => async () => {
      del(`tunnel/${id}`)
        .then((data) => data.json())
        .then(handleApiResponse)
        .then(() => {
          if (mutateAgent) return mutateAgent();
        });
    },
    [mutateAgent]
  );

  const onTunnelStart = useCallback(
    (id: string, iface: string) => async () => {

      post(`tunnel/${id}`, {
        interface: iface
      })
        .then((data) => data.json())
        .then(handleApiResponse)
        .then(() => {
          if (mutateAgent) return mutateAgent();
        });
    },
    [mutateAgent]
  );

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <>
      <InterfaceCreationModal mutate={mutateInterface} onOpenChange={onInterfaceCreationModalOpenChange}
                              isOpen={isInterfaceCreationModalOpen} />
      <AutorouteModal mutate={mutateInterface} onOpenChange={onAutorouteModalOpenChange}
                      isOpen={isAutorouteModalOpen} selectedAgent={selectedAgent} />

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
              <CircularProgress aria-label="Loading..." size="sm" />
            }
            emptyContent={"No agents connected."}
          >
            <>
              {agents
                ? Object.entries<LigoloAgent>(agents).map(([row, agent]) => (
                  <TableRow key={row}>
                    <TableCell>{row}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm">{agent.Name}</p>
                        <p className="text-bold text-sm text-default-400">
                          {agent.RemoteAddr} - {agent.SessionID}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm">{agent.Interface}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        className="capitalize"
                        color={agent.Running ? "success" : "danger"}
                        size="sm"
                        variant="flat"
                      >
                        {agent.Running ? "Tunneling" : "Stopped"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="relative flex items-center gap-2">
                        <Button isIconOnly>
                          <Tooltip
                            content={
                              <div className="px-1 py-2">
                                <div className="text-small font-bold">
                                  Interface information
                                </div>
                                {agent.Network.map((network) => (
                                  <div
                                    key={network.Name}
                                    className={"text-tiny"}
                                  >
                                    {network.Name} :{" "}
                                    {network.Addresses
                                      ? network.Addresses.map((net) => (
                                        <Chip key={net}>{net}</Chip>
                                      ))
                                      : null}
                                  </div>
                                ))}
                              </div>
                            }
                          >
                            <ListCollapse size={20} />
                          </Tooltip>
                        </Button>

                        <Button isIconOnly onPress={() => {
                          setSelectedAgent(row as unknown as keyof LigoloAgentList);
                          onAutorouteOpen();
                        }}>
                          <Tooltip
                            content={"Autoroute"}
                          >
                            <Cog size={20} />
                          </Tooltip>
                        </Button>


                        {agent.Running ? (
                          <Button
                            isIconOnly
                            onPress={onTunnelStop(row)}
                            color={"danger"}
                          >
                            <Tooltip
                              content={"Stop tunneling"}
                              color={"danger"}
                            >
                              <PowerOff size={20} />
                            </Tooltip>
                          </Button>
                        ) : (
                          <>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button isIconOnly color={"success"}>
                                  <Tooltip
                                    content={"Setup tunneling"}
                                    color={"success"}
                                  >
                                    <Power size={20} />
                                  </Tooltip>
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu aria-label="Static Actions">
                                <DropdownItem
                                  key="new"
                                  startContent={
                                    <NetworkIcon className={iconClasses} />
                                  }
                                  showDivider
                                  description={
                                    "Create a random interface then start the tunnel"
                                  }
                                  onPress={onOpenInterfaceCreationModal}
                                >
                                  Start with a new interface
                                </DropdownItem>
                                <>
                                  {interfaces
                                    ? Object.keys(interfaces).map(
                                      (ifName) => (
                                        <DropdownItem
                                          key={ifName}
                                          startContent={
                                            <ChevronsLeftRightEllipsis
                                              className={iconClasses}
                                            />
                                          }
                                          description="Use the following interface"
                                          onPress={onTunnelStart(
                                            row,
                                            ifName
                                          )}
                                        >
                                          Bind to {ifName}
                                        </DropdownItem>
                                      )
                                    )
                                    : null}
                                </>
                              </DropdownMenu>
                            </Dropdown>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                : null}
            </>
          </TableBody>
        </Table>
      </section>
    </>
  );
}
