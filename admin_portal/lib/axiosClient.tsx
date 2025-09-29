import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Use environment variables for flexibility
  timeout: 5000, // Set request timeout
  headers: { "Content-Type": "application/json" },
  //   withCredentials: true,
  withXSRFToken: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.user.access_token;
    // const token = process.env.NEXT_PUBLIC_TOKEN_USER; // Fetch token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle specific error conditions here
    if (error.response && error.response.status === 401) {
      // console.log("error?");
      // const router = useRouter();

      // // redirect("/unauthenticated");
      // router.replace("/unauthenticated");
      window.location.href = "/unauthenticated";
    }
    return Promise.reject(error); // Crucial for error propagation
  }
);

export default axiosClient;
