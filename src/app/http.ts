import axios, { AxiosRequestConfig } from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:4444'
});

http.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const access = localStorage.getItem("accessToken");
      if (access) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.headers.Authorization = `Bearer ${access}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
  
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest.retry) {
        originalRequest.retry = true;
  
        return http
          .post("/auth/refresh", {
            token: localStorage.getItem("accessToken"),
          })
          .then((res) => {
            localStorage.setItem("accessToken", res.data.token);
            http.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
            return http(originalRequest);
          })
          .catch(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("payload");
          });
      }
      return Promise.reject(error);
    }
  );

export {http};