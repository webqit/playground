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

    if (req.url === '/counter') {
        liveMode(req, res);

        const state = { count: 0 };

        const liveRes = new LiveResponse(state);
        res.send(liveRes); // resolves when live mode is established

        const interval = setInterval(() => {
            Observer.set(state, 'count', state.count + 1);
        }, 1_000);

        setTimeout(() => {
            clearInterval(interval);
            res.die();
        }, 60_000);

        return;
    }

    return fs.createReadStream('./src/1_live_state/index.html').pipe(res);
}
