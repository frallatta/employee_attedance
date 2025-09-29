import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

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
    // Check if the error is a 401 and it hasn't been retried yet
    if (error.response && error.response.status === 401) {
      redirect("/unauthenticated");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
