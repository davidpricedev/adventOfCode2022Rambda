import { run } from './day3/index.js';

async function main() {
    await run();
}

console.log("Starting...");
main().then(() => console.log("done." )).catch(err => console.error("unhandled error", err));