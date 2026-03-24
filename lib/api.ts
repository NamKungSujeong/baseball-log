import axios, { AxiosError } from "axios";

export const axiosConfigSetting = () => {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_API_URL;

  axios.interceptors.request.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config: any) => {
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const {
        // config,
        response,
      } = error;

      if (response?.status === 403) {
        // navigate(`/metarich/login`);
        // const originalRequest = config;
        // const ci = await AsyncStorage.getItem("ci");
        // if (ci) {
        //   // // token refresh 요청
        //   const response = await axios.post(
        //     "member/login", // token refresh api
        //     {
        //       ci,
        //     },
        //   );
        //   if (response?.data?.common?.message === "success") {
        //     await AsyncStorage.setItem("token", response.data.data.token!);
        //     const token = await AsyncStorage.getItem("token");
        //     originalRequest.headers.Authorization = `Bearer ${token}`;
        //     // 401로 요청 실패했던 요청 새로운 accessToken으로 재요청
        //     return axios(originalRequest);
        //   }
        // }
      }
      return Promise.reject(error);
    },
  );
};
