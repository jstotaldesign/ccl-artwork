/**
 * Toast + AlertDialog pub/sub. Imperative API — call from anywhere.
 *
 * Mount <ToastHost /> once in the root layout. The host subscribes to the
 * bus and renders the stack. Replaces alert() / confirm() / prompt() — never
 * use those in app code.
 */

let _toastSeq = 0;

export interface ToastItem {
  id: number;
  kind: "success" | "error" | "info" | "warning";
  message: string;
  ttl?: number;
}

const toastSubs = new Set<(items: ToastItem[]) => void>();
let toasts: ToastItem[] = [];

function emit() {
  for (const s of toastSubs) s(toasts);
}

export const _subscribe = (cb: (items: ToastItem[]) => void): (() => void) => {
  toastSubs.add(cb);
  cb(toasts);
  return () => {
    toastSubs.delete(cb);
  };
};

export const _dismiss = (id: number) => {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
};

function push(kind: ToastItem["kind"], message: string, ttl = 4000) {
  const id = ++_toastSeq;
  toasts = [...toasts, { id, kind, message, ttl }];
  emit();
  if (ttl > 0) setTimeout(() => _dismiss(id), ttl);
}

export const toast = {
  success: (msg: string, ttl?: number) => push("success", msg, ttl),
  error: (msg: string, ttl?: number) => push("error", msg, ttl ?? 6000),
  info: (msg: string, ttl?: number) => push("info", msg, ttl),
  warning: (msg: string, ttl?: number) => push("warning", msg, ttl),
};

// ─── AlertDialog ────────────────────────────────────────────────────────────

export interface AlertDialogItem {
  id: number;
  title: string;
  message?: string;
  variant: "info" | "warning" | "danger" | "success";
  confirmLabel?: string;
  cancelLabel?: string;
  resolve: (ok: boolean) => void;
}

const dialogSubs = new Set<(item: AlertDialogItem | null) => void>();
let activeDialog: AlertDialogItem | null = null;

function emitDialog() {
  for (const s of dialogSubs) s(activeDialog);
}

export const _subscribeDialog = (cb: (item: AlertDialogItem | null) => void): (() => void) => {
  dialogSubs.add(cb);
  cb(activeDialog);
  return () => {
    dialogSubs.delete(cb);
  };
};

export const _closeDialog = (ok: boolean) => {
  if (!activeDialog) return;
  const d = activeDialog;
  activeDialog = null;
  emitDialog();
  d.resolve(ok);
};

interface DialogOpts {
  title: string;
  message?: string;
  variant?: AlertDialogItem["variant"];
  confirmLabel?: string;
  cancelLabel?: string;
}

function show(opts: DialogOpts): Promise<boolean> {
  return new Promise((resolve) => {
    const id = ++_toastSeq;
    activeDialog = {
      id,
      title: opts.title,
      message: opts.message,
      variant: opts.variant ?? "info",
      confirmLabel: opts.confirmLabel,
      cancelLabel: opts.cancelLabel,
      resolve,
    };
    emitDialog();
  });
}

export const alertDialog = {
  confirm: (opts: DialogOpts) => show({ ...opts, variant: opts.variant ?? "warning" }),
  alert: (opts: Omit<DialogOpts, "cancelLabel">) => show({ ...opts, cancelLabel: "" }),
  danger: (opts: DialogOpts) => show({ ...opts, variant: "danger" }),
};
