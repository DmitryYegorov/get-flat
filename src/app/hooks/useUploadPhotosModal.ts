import { create } from 'zustand';
 
interface UploadPhotosModalStore {
   isOpen: boolean;
   onOpen: () => void;
   onClose: () => void;
}

const useUploadPhotosModal = create<UploadPhotosModalStore>((set) => ({
   isOpen: false,
   onOpen: () => set({isOpen: true}),
   onClose: () => set({isOpen: false})
}));

export default useUploadPhotosModal;