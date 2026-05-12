#!/usr/bin/env node
/**
 * Smart dev launcher — find the first free port starting from 3000 (or $PORT),
 * then spawn `next dev` on it. Avoids the interactive "Port in use, use 3001?"
 * prompt and works when multiple Next.js apps are running on the same machine.
 */

import net from "node:net";
import { spawn } from "node:child_process";

const start = Number(process.env.PORT) || 3000;
const max = start + 20;

async function isFree(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once("error", () => resolve(false));
    s.once("listening", () => s.close(() => resolve(true)));
    s.listen(port, "0.0.0.0");
  });
}

let port = start;
while (port <= max && !(await isFree(port))) port++;

if (port > max) {
  console.error(`No free port found in ${start}–${max}`);
  process.exit(1);
}

if (port !== start) {
  console.log(`▲ Port ${start} busy — using ${port}`);
}

const child = spawn("next", ["dev", "-p", String(port)], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
