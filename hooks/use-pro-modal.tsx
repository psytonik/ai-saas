import { create } from "zustand";
interface UseProModal {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}
export const useProModal = create<UseProModal>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));
