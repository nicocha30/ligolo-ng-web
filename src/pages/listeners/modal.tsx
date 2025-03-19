import { useCallback, useContext, useState } from "react";
import useAgents from "@/hooks/useAgents.ts";
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
import { EthernetPort } from "lucide-react";
import { useApi } from "@/hooks/useApi.ts";
import { LigoloAgent } from "@/types/agents.ts";
import ErrorContext from "@/contexts/Error.tsx";

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
  const [selectedAgent, setSelectedAgent] = useState(agentId);
  const [listenerProtocol, setListenerProtocol] = useState("");
  const [redirectAddr, setRedirectAddr] = useState("");
  const [listeningAddr, setListeningAddr] = useState("");

  const { post } = useApi();
  const { agents } = useAgents();
  const { setError } = useContext(ErrorContext);

  const addInterface = useCallback(
    (callback: () => unknown) => async () => {
      await post("listeners", {
        listenerAddr: listeningAddr,
        redirectAddr,
        agentId: selectedAgent,
        network: listenerProtocol
      }).catch(setError);

      if (mutate) mutate();
      if (callback) callback();
    },
    [mutate, selectedAgent, listeningAddr, redirectAddr, listenerProtocol]
  );

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
                  ? Object.entries<LigoloAgent>(agents).map(([row, agent]) => (
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
                  <EthernetPort className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Agent listening address"
                placeholder="0.0.0.0:1234"
                variant="bordered"
                value={listeningAddr}
                onValueChange={setListeningAddr}
              />
              <Input
                endContent={
                  <EthernetPort className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
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
              <Button color="primary" onPress={addInterface(onClose)}>
                Add listener
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
