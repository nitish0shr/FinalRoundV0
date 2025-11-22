import { create } from 'zustand'

interface CommandPaletteStore {
    isOpen: boolean
    openCommandPalette: () => void
    closeCommandPalette: () => void
    toggleCommandPalette: () => void
}

export const useCommandPalette = create<CommandPaletteStore>((set) => ({
    isOpen: false,
    openCommandPalette: () => set({ isOpen: true }),
    closeCommandPalette: () => set({ isOpen: false }),
    toggleCommandPalette: () => set((state) => ({ isOpen: !state.isOpen })),
}))
