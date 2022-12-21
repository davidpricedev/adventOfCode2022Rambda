import { run } from './day6/index.js';

async function main() {
    await run();
}

console.log("Starting...");
main().then(() => console.log("done." )).catch(err => console.error("unhandled error", err));
