'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastData {
  id: number;
  message: string;
}

let toastListeners: Array<(t: ToastData | null) => void> = [];

export function showToast(message: string) {
  const id = Date.now();
  toastListeners.forEach((fn) => fn({ id, message }));
  setTimeout(() => {
    toastListeners.forEach((fn) => fn(null));
  }, 2600);
}

export function addToastListener(fn: (t: ToastData | null) => void) {
  toastListeners.push(fn);
  return () => {
    toastListeners = toastListeners.filter((l) => l !== fn);
  };
}

export default function Toast() {
  const [notice, setNotice] = useState<ToastData | null>(null);

  useEffect(() => {
    const unsub = addToastListener(setNotice);
    return unsub;
  }, []);

  if (!notice) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-sm border border-moss/20 bg-paper p-4 shadow-soft sm:left-auto sm:right-5 sm:translate-x-0">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="shrink-0 text-moss" size={20} />
        <p className="flex-1 text-sm font-semibold text-ink">{notice.message}</p>
        <button className="grid size-8 place-items-center text-ink/48 hover:text-ink" type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
