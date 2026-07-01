import http from 'http';
import fs from 'fs';
import { LiveResponse } from '@webqit/fetch-plus';
import { PGClient } from '@linked-db/linked-ql/postgres';
import { EdgeWorker } from '@linked-db/linked-ql/edge-worker';
import { enableLive, Observer } from '@webqit/node-live-response';
import { setup, cleanup } from '../4_live_queries/setup.js';

const server = http.createServer(handler);
const liveMode = enableLive(server);

server.listen(3000);
console.log('Server started on port 3000');
console.log("Press Ctrl+C to cleanup and exit...");

// ------------

await setup();

const db = new PGClient({ poolMode: false });
await db.connect();
const httpEdge = EdgeWorker.httpWorker({ db });

const gc = async () => {
    await db.disconnect();
    await cleanup();
};
process.on('SIGINT', gc);
process.on('SIGTERM', gc);

// ------------

async function handler(req, res) {

    if (req.url.split('?')[0] === '/api/db') {
        liveMode(req, res);
        let livePromise;

        const event = {
            request: toStandardRequest(req),
            client: req.port,
            respondWith: (payload) => res.send(new LiveResponse(payload)),
            waitUntil: (promise) => livePromise = promise,
        };

        await httpEdge.handle(event);

        Promise.resolve(livePromise).then(async () => {
            res.die();
            console.log("Live session aborted and connection closed after 10 minutes.");
        });

        return;
    }

    return fs.createReadStream('./src/6_sync/index.html').pipe(res);
}

const toStandardRequest = (request) => {
    return new Request(`http://localhost${request.url}`, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request,
        duplex: 'half',
    });
};
