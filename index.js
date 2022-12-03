import { run } from './day1/day1.js';

async function main() {
    await run();
}

console.log("Starting...");
main().then(() => console.log("done." )).catch(err => console.error("unhandled error", err));