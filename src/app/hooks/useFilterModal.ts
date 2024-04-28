import dayjs from "dayjs";
import zustand, { create } from "zustand";

interface FilterStore {
    isOpen: boolean;
    onOpen: (arg: any) => void;
    onClose: (arg: any) => void;
    setParams: (args: any) => void;
    params: any;
}

const useFilter = create<FilterStore>((set) => ({
    isOpen: false,
    onOpen: ({params}: any) => set({isOpen: true, params}),
    onClose: () => set({isOpen: false}),
    setParams: (params) => set({params}),
    params: {},
}));

export default useFilter;