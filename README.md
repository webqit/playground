# LiveResponse & LinkedQL Playground

Welcome to the **LiveResponse & LinkedQL Playground**!

This directory contains series of interactive examples that demonstrate the core capabilities of **[LiveResponse](https://github.com/webqit/node-live-response)** and **[LinkedQL](https://github.com/linked-db/linked-ql)**—both independently and together.

> **💡 Hack around!** Don't hesitate to open the files in these directories, tweak the code, and observe the behaviors. This playground is designed for you to get your hands dirty!

---

## 1. LiveResponse Recipes

These recipes demonstrate the **live response** model independently. They build on the core concept of **LiveResponse**—an extension of traditional HTTP responses that allows for stateful, updatable, and deeply interactive real-time connections using a single primitive.

### [1_live_state](./src/1_live_state)

Demonstrates LiveResponse's most fundamental feature: **sending a mutable object as the response body**. Server-side mutations made to this object automatically update the client-side copy in real-time.

### [2_multi_response](./src/2_multi_response)

Demonstrates LiveResponse's multi-response model where responses are **swapped with newer ones over a single HTTP request**.

### [3_messaging](./src/3_messaging)

Demonstrates LiveResponse's messaging model: exchanging messages between the client and server through an exposed **communication port** natively provided by the live response channel.

---

## 2. LinkedQL Recipes

These recipes demonstrate **LinkedQL's** _live queries_ and _sync_ capabilities.

**All three examples in this section build the exact same Todo List application** – but each implements it using a different architectural pattern, based on [LinkedQL Integration Patterns](https://linked-ql.netlify.app/guides/integration-patterns). You can observe how the application is architected differently under the hood across three distinct paradigms.

> **Prerequisite:** The LinkedQL examples assume you have a **PostgreSQL database running on your local machine** using the default parameters (e.g., `localhost:5432`) and **no password**. They also assume that [PostgreSQL's logical replication is enabled](https://linked-ql.netlify.app/guides/postgresql#realtime-setup) on the database.
>
> The examples will automatically connect and set up the necessary table(s) for the TODO app. Tables are automatically dropped when the process ends.

**🌟 Best Experience:** Since these examples heavily emphasize multi-client reactivity and real-time sync, they are **best experienced with at least two tabs of the page open side-by-side**. You'll be able to see database updates and offline edits sync seamlessly across clients the moment they happen.

### [4_live_queries](./src/4_live_queries)

**Architecture: Direct Live Queries**

Demonstrates live queries over PostgreSQL where the live result is projected across the wire and obtained on the client side by reference. The server runs the query against PostgreSQL and sends the result to the client as a live response. 

### [5_remote_querying](./src/5_remote_querying)

**Architecture: Remote Querying**

Demonstrates remote querying using a dedicated `EdgeWorker`. Here, the `EdgeWorker` exposes a PostgreSQL database on the server, and the client application directly queries it using an `EdgeClient`. Live queries still work seamlessly across the protocol.

### [6_sync](./src/6_sync)

**Architecture: Local-First Synchronization**

Showcases full offline-capable, local-first database synchronization. Instead of just querying remote data, the client maintains a synchronized local copy of the database tables.


---

## Running the Examples

⤷ clone → install → run

```
git clone https://github.com/webqit/playground.git
cd playground
npm install
```

The runnable examples live in the `src` dir. Each example consists of at least a basic `server.js` file and a small `index.html` file. **The examples in LinkedQL Recipes also have a screencast video of the demo itself.** Playing the screencast before running the code in each case is recommended.

To run any example:

1. Open your terminal in the **root** of the repository.
2. Run the `server.js` script of the desired example using Node.js:

   ```bash
   node src/1_live_state/server.js
   ```

3. Open **[http://localhost:3000](http://localhost:3000)** in your browser to interact with the live demo.

> **Note:** For some examples, you will also notice an `update.js` script in the directory. You can run this script in a separate terminal window to programmatically trigger database updates and watch the live results stream to your open browser tabs.

4. Stop an example and have its resources automatically cleaned up by press `Ctrl+C` in your server terminal.
