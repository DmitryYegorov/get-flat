import zustand, { create } from "zustand";

interface AuthStore {
    isAuthorized: boolean;
    user?: any | null;
    authotizedAt?: Date | null;
    onAuthorized: (payload: any) => void;
    onLogout: () => void;
}

const useAuth = create<AuthStore>((set) => ({
    isAuthorized: false,
    onAuthorized: (payload: any) => 
        set({
            isAuthorized: true,
            user: payload.user,
            authotizedAt: payload.authorized,
        }),
    onLogout: () => set({isAuthorized: false, user: null, authotizedAt: null})
}));

export default useAuth;