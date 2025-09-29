import axios from "axios";
import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Use environment variables for flexibility
  timeout: 5000, // Set request timeout
  headers: { "Content-Type": "application/json" },
});

axiosServer.interceptors.request.use(
  async (config) => {
    // const token = process.env.NEXT_PUBLIC_TOKEN_USER; // Fetch token from storage
    const session = await getServerSession(authOptions);
    const token = session?.user.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

axiosServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle specific error conditions here
    if (error.response && error.response.status === 401) {
      redirect("/unauthenticated");
    }
    return Promise.reject(error); // Crucial for error propagation
  }
);

export default axiosServer;
