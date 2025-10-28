declare module 'phoenix' {
  export class Socket {
    constructor(endpoint: string, opts?: any);
    connect(): void;
    disconnect(callback?: any): void;
    onOpen(cb: () => void): void;
    onError(cb: (err?: any) => void): void;
    onClose(cb: () => void): void;
    channel(topic: string, params?: any): Channel;
  }

  export interface Channel {
    join(): Channel;
    receive(status: 'ok' | 'error' | string, callback: (response?: any) => void): Channel;
    on(event: string, callback: (payload: any) => void): void;
    push(event: string, payload?: any): void;
    leave(): void;
  }
}
