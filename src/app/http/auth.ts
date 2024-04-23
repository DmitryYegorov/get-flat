import { http } from ".";

export const getCurrentUser = () => http.get('/users/auth/me');