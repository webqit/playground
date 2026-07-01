import http from 'http';
import fs from 'fs';
import { LiveResponse } from '@webqit/fetch-plus';
import { PGClient } from '@linked-db/linked-ql/postgres';
import { enableLive, Observer } from '@webqit/node-live-response';
import { setup, cleanup } from './setup.js';

const server = http.createServer(handler);
const liveMode = enableLive(server);

server.listen(3000);
console.log('Server started on port 3000');
console.log("Press Ctrl+C to cleanup and exit...");

// ------------

await setup();

const db = new PGClient();
await db.connect();

const gc = async () => {
    await db.disconnect();
    await cleanup();
};
process.on('SIGINT', gc);
process.on('SIGTERM', gc);

// ------------

async function handler(req, res) {

    if (req.url === '/list') {
        liveMode(req, res);

        const result = await db.query(`SELECT * FROM test_todos;`, { live: true });

        const liveRes = new LiveResponse(result.rows);
        res.send(liveRes); // resolves when live mode is established

        setTimeout(async () => {
            await result.abort();
            res.die();
            console.log("Live response aborted and connection closed after 10 minutes.");
        }, 600_000);

        return;
    }

    return fs.createReadStream('./src/4_live_queries/index.html').pipe(res);
}
