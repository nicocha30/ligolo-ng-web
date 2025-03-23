export interface LigoloAgent {
  Name: string;
  Network: Network[];
  Session: Session;
  SessionID: string;
  Interface: string;
  Running: boolean;
  Listeners: unknown;
  RemoteAddr: string;
}

export interface Network {
  Index: number;
  MTU: number;
  Name: string;
  HardwareAddr?: string;
  Flags: number;
  Addresses?: string[];
}

export type Session = object

export type LigoloAgentList = Record<number, LigoloAgent>
