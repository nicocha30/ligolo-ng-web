
export interface LigoloAgent {
    Name: string
    Network: Network[]
    Session: Session
    SessionID: string
    Interface: string
    Running: boolean
    Listeners: any
    RemoteAddr: string
}

export interface Network {
    Index: number
    MTU: number
    Name: string
    HardwareAddr?: string
    Flags: number
    Addresses?: string[]
}

export interface Session {}

export type LigoloAgentList = Record<string,LigoloAgent>
