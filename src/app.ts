#! node

import WebSocket from 'ws';
import * as stun from 'stun';
import * as dgram from 'dgram';

(async () => {
    const socket = dgram.createSocket('udp4');
    const server = stun.createServer(socket);

    const { STUN_BINDING_RESPONSE, STUN_EVENT_BINDING_REQUEST } = stun.constants;

    server.on(STUN_EVENT_BINDING_REQUEST, () => {
        const message = stun.createMessage(STUN_BINDING_RESPONSE);
        message.addSoftware(`node/${process.version} stun/v1`);
    });

    server.on('error', (error: stun.StunError) => {
        process.stderr.write(error.message);

        if (error instanceof stun.StunError && error.sender) {
            const { address, port } = error.sender;
            process.stderr.write(` received from ${address}:${port}`);
        }

        process.stderr.write('\n');
    });

    socket.bind(3478, () => {
        const { address, port } = socket.address();
        process.stdout.write(`stun server started at ${address}:${port}\n`);
    });

    stun.createServer({
        type: 'udp4',
        socket: dgram.createSocket({ type: 'udp4' }),
    });

    const wss = new WebSocket.Server({ port: 8090 });
    wss.on('listening', () => {
        console.log(`listening ws connections on port ${wss.address().port}`);
    });

    wss.on('connection', ws => {
        ws.on('message', message => { console.log('received: %s', message) });
        ws.send('something');
    });
})();
