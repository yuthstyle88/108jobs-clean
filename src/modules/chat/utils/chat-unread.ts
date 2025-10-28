// Thin indirection layer around unread store to decouple consumers from store implementation
// Consumers should import from '@/chat' instead of '@/store/unreadStore'

import {useUnreadStore as baseStore} from '@/modules/chat/store/unreadStore';

export const useUnreadStore = baseStore;

export function useTotalUnread(): number {
  return baseStore((s) => s.total);
}

// React hook variant — only use at top level of a component or custom hook
export function useUnreadActions() {
  return {
    inc: baseStore((s) => s._inc),
    reset: baseStore((s) => s.reset),
    clearAll: baseStore((s) => s.clearAll),
    markSeen: baseStore((s) => s.markSeen),
  };
}

// Non-hook accessor — safe to call anywhere (effects, event handlers, non-React modules)
export function getUnreadActions() {
  const { _inc, reset, clearAll, markSeen } = baseStore.getState();
  return { _inc, reset, clearAll, markSeen };
}
