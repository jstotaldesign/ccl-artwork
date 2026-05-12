/**
 * In-process pub/sub for SSE broadcasts. Single-server only — swap for Redis
 * pub/sub when scaling horizontally (same API).
 *
 * Stored on globalThis so Next.js HMR doesn't create multiple emitters that
 * would orphan SSE listeners across module reloads.
 */

import { EventEmitter } from "node:events";

type Bus = EventEmitter;

const g = globalThis as unknown as { __nextPolyglotBus?: Bus };

const bus: Bus =
  g.__nextPolyglotBus ??
  ((): Bus => {
    const e = new EventEmitter();
    e.setMaxListeners(0); // 1 listener per active SSE connection
    g.__nextPolyglotBus = e;
    return e;
  })();

export type BusEvent = {
  kind: string;
  tenantId: string;
  ts: number;
  [key: string]: unknown;
};

const channel = (tenantId: string) => `tenant:${tenantId}`;

export function broadcast(tenantId: string, kind: string, payload: Record<string, unknown> = {}): void {
  bus.emit(channel(tenantId), { kind, tenantId, ts: Date.now(), ...payload });
}

export function subscribe(tenantId: string, handler: (event: BusEvent) => void): () => void {
  const ch = channel(tenantId);
  bus.on(ch, handler);
  return () => bus.off(ch, handler);
}
