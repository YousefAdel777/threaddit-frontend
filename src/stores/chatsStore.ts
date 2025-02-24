import { create } from "zustand";

type State = {
    chats: Chat[];
    isChatsOpen: boolean;
    isChatsExpanded: boolean;
    // currentChatId: number | null;
    userId: number | null;
    setChats: (chats: Chat[]) => void;
    setIsChatsOpen: (isOpen: boolean) => void;
    setIsChatsExpanded: (isExpanded: boolean) => void;
    // setCurrentChatId: (id: number | null) => void;
    setUserId: (id: number | null) => void;
};

export const useChatsStore = create<State>((set) => {
    return {
        chats: [],
        isChatsOpen: false,
        isChatsExpanded: false,
        // currentChatId: null,
        userId: null,
        setChats: (chats: Chat[]) => set((state) => ({ ...state, chats })),
        setIsChatsOpen: (isOpen: boolean) => set((state) => ({ ...state, isChatsOpen: isOpen })),
        setIsChatsExpanded: (isExpanded: boolean) => set((state) => ({ ...state, isChatsExpanded: isExpanded })),
        // setCurrentChatId: (id: number | null) => set((state) => ({ ...state, currentChatId: id })),
        setUserId: (id: number | null) => set((state) => ({ ...state, userId: id })),
    };
});