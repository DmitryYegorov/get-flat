import {http} from ".";

export const getAllCreatedReviews = () => http.get('/admin/reviews/created');

export const approveReviewRequest = (id: string) => http.post('/admin/reviews/approve', {reviewId: id});

export const rejectReviewRequest = (id: string, notes: string) => http.post('/admin/reviews/reject', {reviewId: id, rejectNotes: notes});

export const getCreatedRealties = () => http.get('/admin/realty/created');

export const rejectRealtyRequest = (id: string, notes: string) => http.post('/admin/realty/reject', {realtyId: id, rejectionNotes: notes});

export const approveRealtyRequest = (id: string) => http.post('/admin/realty/approve', {realtyId: id});

export const getUsersList = () => http.get('/admin/users/list');

export const blockUserReq = (userId: string, blockNotes: string) => http.post('/admin/users/block', {userId, blockNotes});
export const unblockUserReq = (userId: string) => http.post('/admin/users/unblock', {userId});

export const sendVerificationLetter = (userId: string) => http.post('/admin/users/send-activation-letter', {userId});