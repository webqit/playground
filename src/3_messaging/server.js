import http from 'http';
import fs from 'fs';
import { LiveResponse } from '@webqit/fetch-plus';
import { enableLive, Observer } from '@webqit/node-live-response';

const server = http.createServer(handler);
const liveMode = enableLive(server);

server.listen(3000);
console.log('Server started on port 3000');
console.log("Press Ctrl+C to cleanup and exit...");

// ------------

async function handler(req, res) {

    if (req.url === '/chat') {
        liveMode(req, res);

        const liveRes = new LiveResponse({ title: 'Chat' });
        await res.send(liveRes); // resolves when live mode is established

        req.port.addEventListener('message', (e) => {
            req.port.postMessage(e.data);
        });

        setTimeout(() => {
            res.die();
        }, 60_000);

        return;
    }

    return fs.createReadStream('./src/3_messaging/index.html').pipe(res);
}
