/**
 * Generic data-fetching hook — replaces useState+useEffect+setLoading+try/catch+fetch.
 *
 * Caller passes a URL string. The hook re-fetches whenever the URL changes,
 * and cancels in-flight requests via AbortController to prevent stale data.
 * Pass `url = null` to skip the fetch (e.g., before an ID resolves).
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseFetchOptions<T> {
  manual?: boolean;
  initialData?: T;
  init?: RequestInit;
  onError?: (message: string) => void;
  onSuccess?: (data: T) => void;
}

export interface UseFetchResult<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
  truncated: boolean;
}

export function useFetch<T = unknown>(
  url: string | null | undefined,
  opts: UseFetchOptions<T> = {},
): UseFetchResult<T> {
  const { manual = false, initialData, init } = opts;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(!manual && !!url);
  const [error, setError] = useState<string | null>(null);
  const [truncated, setTruncated] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);
  const initRef = useRef(init);
  initRef.current = init;
  const onErrorRef = useRef(opts.onError);
  onErrorRef.current = opts.onError;
  const onSuccessRef = useRef(opts.onSuccess);
  onSuccessRef.current = opts.onSuccess;

  const refresh = useCallback(async (): Promise<void> => {
    if (!url) return;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, { ...initRef.current, signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as T;
      if (!ctrl.signal.aborted) {
        setData(json);
        setTruncated(res.headers.get("X-Has-More") === "1");
        onSuccessRef.current?.(json);
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      if (!ctrl.signal.aborted) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        onErrorRef.current?.(msg);
      }
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (manual) return;
    if (!url) {
      setLoading(false);
      return;
    }
    refresh();
    return () => {
      abortRef.current?.abort();
    };
  }, [refresh, manual, url]);

  return { data, loading, error, refresh, setData, truncated };
}
