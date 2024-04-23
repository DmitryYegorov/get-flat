import dayjs from "dayjs";
import zustand, { create } from "zustand";

interface BookingStore {
    isOpen: boolean;
    onOpen: (arg: any) => void;
    onClose: (arg: any) => void;
    realty: any;
    startDate: string | Date;
    endDate: string | Date;
    user: any;
}

const useBooking = create<any>((set) => ({
    isOpen: false,
    onOpen: ({realty, startDate, endDate, user}: any) => set({isOpen: true, realty, startDate, endDate, user}),
    onClose: () => set({isOpen: false}),
    realty: null,
    startDate: dayjs(),
    endDate: dayjs(),
    user: null,
}));

export default useBooking;