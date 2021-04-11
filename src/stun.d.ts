declare module 'stun' {
    import * as events from 'events';
    import * as dgram from 'dgram';

    export function createMessage(type: number, transaction?: Buffer): StunRequest;

    interface serverOptions extends Object {
        type: dgram.SocketType,
        socket?: dgram.Socket,
    }

    export function createServer(options: serverOptions): StunServer;
    export function createServer(socket: dgram.Socket,): StunServer;

    export function createTransaction(): Buffer;

    class StunRequest {
        public addSoftware(software: string): StunByteStringAttribute;
    }
    class StunServer extends events.EventEmitter {
        constructor(socket: dgram.Socket);
    }

    export const constants: string[
        "STUN_BINDING_RESPONSE" |
        "STUN_EVENT_BINDING_REQUEST"
    ];

    interface senderObject extends Object {
        address: string,
        port: number,
    }

    class StunError extends Error {
        public sender: senderObject | undefined;
    }
}
