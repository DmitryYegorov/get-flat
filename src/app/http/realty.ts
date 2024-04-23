import { http } from ".";

export const likeRealty = (realtyId: string) => http.post(`/realty/like`, {realtyId});

export const getFavoriteRealties = () => http.get('/realty/favorites');

export const getRealtyDetails = (id: string) => http.get(`/realty/${id}`);

export const updateRealty = (id: string, data: any) => http.patch(`/realty/${id}`, data);