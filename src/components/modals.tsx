import { useCallback, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from "@heroui/react";
import { DicesIcon, EthernetPort, NetworkIcon } from "lucide-react";
import useAgents from "@/hooks/use-agents.ts";
import { useAuth } from "@/authprovider.tsx";
import { generateSlug } from "random-word-slugs";
import isCidr from "is-cidr";
import { handleApiResponse } from "@/hooks/toast.ts";

interface RouteCreationProps {
  isOpen?: boolean;
  onOpenChange?: () => void;
  selectedInterface?: string | undefined;
  mutate?: () => Promise<unknown>;
}

export function RouteCreationModal({
                                     isOpen,
                                     onOpenChange,
                                     selectedInterface,
                                     mutate
                                   }: RouteCreationProps) {
  const auth = useAuth();

  const onRouteAdd = useCallback(
    (iface: string | undefined, route: string) => async () => {
      await fetch(`${auth?.api}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${auth?.authToken}`
        },
        body: JSON.stringify({
          interface: iface,
          route: route
        })
      }).then((data) => data.json()).then(handleApiResponse).then(() => {
        if (mutate) return mutate();
      });
    },
    [mutate]
  );

  const [route, setRoute] = useState("");

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Setup new route to {selectedInterface}
            </ModalHeader>
            <ModalBody>
              <Input
                endContent={
                  <EthernetPort
                    className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Route"
                placeholder="Enter the new route to add to the interface"
                variant="bordered"
                type={"text"}
                value={route}
                onValueChange={setRoute}
                validate={(value) => {
                  if (!isCidr(value)) {
                    return "Please specify a valid CIDR";
                  }
                  return true;
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="success"
                onPress={onRouteAdd(selectedInterface, route)}
              >
                Add route
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

interface InterfaceCreationProps {
  isOpen?: boolean;
  onOpenChange?: () => void;
  mutate?: () => Promise<unknown>;
}

export function InterfaceCreationModal({
                                         isOpen,
                                         onOpenChange,
                                         mutate
                                       }: InterfaceCreationProps) {
  const auth = useAuth();

  const [interfaceName, setInterfaceName] = useState("");

  const onInterfaceCreate = useCallback(
    (iface: string) => async () => {
      await fetch(`${auth?.api}/interfaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${auth?.authToken}`
        },
        body: JSON.stringify({
          interface: iface
        })
      }).then((data) => data.json()).then(handleApiResponse).then(() => {
        if (mutate) return mutate();
      });
    },
    [mutate]
  );

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Interface creation
            </ModalHeader>
            <ModalBody>
              <div className={"flex py-2 px-1 justify-between gap-2"}>
                <Input
                  endContent={
                    <NetworkIcon
                      className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Interface name"
                  placeholder="Enter the new interface name"
                  variant="bordered"
                  type={"text"}
                  maxLength={15}
                  value={interfaceName}
                  onValueChange={setInterfaceName}
                />
                <Button
                  isIconOnly
                  aria-label="Like"
                  color="danger"
                  className={"min-w-14 w-14 h-14"}
                  onPress={() => {
                    setInterfaceName(
                      generateSlug(2).replace("-", "").substring(0, 15)
                    );
                  }}
                >
                  <DicesIcon />
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="success"
                onPress={onInterfaceCreate(interfaceName)}
              >
                Create interface
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

interface ListenerCreationProps {
  isOpen?: boolean;
  onOpenChange?: () => void;
  mutate?: () => Promise<unknown>;
  agentId?: number;
}

export function ListenerCreationModal({
                                        isOpen,
                                        onOpenChange,
                                        mutate,
                                        agentId
                                      }: ListenerCreationProps) {
  const auth = useAuth();

  const onCreateInterface = useCallback(
    (
      agentId: number | undefined,
      listeningAddr: string,
      redirectAddr: string,
      listenerProtocol: string,
      callback: () => unknown
    ) =>
      async () => {
        await fetch(`${auth?.api}/listeners`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${auth?.authToken}`
          },
          body: JSON.stringify({
            agentId: agentId,
            listenerAddr: listeningAddr,
            redirectAddr: redirectAddr,
            network: listenerProtocol
          })
        }).then((data) => data.json()).then(handleApiResponse).then(() => {
          if (mutate) return mutate();
        });
        await callback();
      },
    [mutate]
  );

  const { agents } = useAgents();

  const [selectedAgent, setSelectedAgent] = useState(agentId);
  const [listenerProtocol, setListenerProtocol] = useState("");
  const [redirectAddr, setRedirectAddr] = useState("");
  const [listeningAddr, setListeningAddr] = useState("");

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add a new listener
            </ModalHeader>
            <ModalBody>
              <Select
                onSelectionChange={(keys) =>
                  setSelectedAgent(Number(keys.currentKey))
                }
                label={"Agent"}
              >
                {agents
                  ? Object.entries(agents).map(([row, agent]) => (
                    <SelectItem
                      key={row}
                      textValue={`${agent.Name} - ${agent.SessionID}`}
                    >
                      {agent.Name} - {agent.SessionID} ({agent.RemoteAddr})
                    </SelectItem>
                  ))
                  : null}
              </Select>
              <Input
                endContent={
                  <EthernetPort
                    className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Agent listening address"
                placeholder="0.0.0.0:1234"
                variant="bordered"
                value={listeningAddr}
                onValueChange={setListeningAddr}
              />
              <Input
                endContent={
                  <EthernetPort
                    className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Redirect target"
                placeholder="127.0.0.1:8080"
                variant="bordered"
                value={redirectAddr}
                onValueChange={setRedirectAddr}
              />
              <Select
                defaultSelectedKeys={listenerProtocol}
                onSelectionChange={(keys) => {
                  setListenerProtocol(String(keys.currentKey));
                }}
                label="Protocol"
                placeholder="Protocol"
              >
                <SelectItem key={"tcp"}>TCP</SelectItem>
                <SelectItem key={"udp"}>UDP</SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={onCreateInterface(
                  selectedAgent,
                  listeningAddr,
                  redirectAddr,
                  listenerProtocol,
                  onClose
                )}
              >
                Add listener
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
