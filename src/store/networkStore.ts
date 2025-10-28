import {create} from 'zustand'

interface NetworkState {
    online: boolean
    setOnline: (v: boolean) => void
    isOnline: () => boolean
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
    online: false,
    setOnline: (v) => set({ online: v }),
    isOnline: () => get().online,
}))