// Safe storage wrapper for browsers (mobile-friendly, SSR-safe)
// Falls back: localStorage -> sessionStorage -> in-memory map
// Never throws; logs only when DEBUG_SAFE_STORAGE === '1'

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear?(): void;
};

class MemoryStorage implements StorageLike {
  private m = new Map<string, string>();
  getItem(key: string) { return this.m.has(key) ? this.m.get(key)! : null; }
  setItem(key: string, value: string) { this.m.set(key, value); }
  removeItem(key: string) { this.m.delete(key); }
  clear() { this.m.clear(); }
}

function isBrowser(): boolean { return typeof window !== 'undefined'; }

function usable(storage: Storage | undefined | null): StorageLike | null {
  if (!storage) return null;
  try {
    const k = '__safe_storage_probe__';
    storage.setItem(k, '1');
    storage.removeItem(k);
    return storage as unknown as StorageLike;
  } catch {
    return null;
  }
}

let cached: StorageLike | null = null;

export function getStorage(): StorageLike {
  if (cached) return cached;
  if (!isBrowser()) { cached = new MemoryStorage(); return cached; }

  const local = usable(window.localStorage);
  if (local) { cached = local; return cached; }
  const session = usable(window.sessionStorage);
  if (session) { cached = session; return cached; }
  cached = new MemoryStorage();
  return cached;
}

export const safeStorage = {
  available(): boolean {
    return isBrowser();
  },
  getItem(key: string): string | null {
    try { return getStorage().getItem(key); } catch { return null; }
  },
  setItem(key: string, value: string): void {
    try { getStorage().setItem(key, value); } catch { /* ignore */ }
  },
  removeItem(key: string): void {
    try { getStorage().removeItem(key); } catch { /* ignore */ }
  },
  clear(): void {
    try { (getStorage().clear?.()) } catch { /* ignore */ }
  },
};

export default safeStorage;
