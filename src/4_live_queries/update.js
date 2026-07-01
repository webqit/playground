import { PGClient } from '@linked-db/linked-ql/postgres';

const db = new PGClient();
await db.connect();

try {
    await db.query(
        `
        UPDATE test_todos SET done = true WHERE id = 2;
        INSERT INTO test_todos (title, done) VALUES ('Finally understand this codebase', false);
        `
    );
    console.log('Todo updated and new todo added');
} catch (err) {
    console.error("Error:", err);
} finally {
    await db.disconnect();
}
