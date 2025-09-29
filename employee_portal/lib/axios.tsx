import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Use environment variables for flexibility
  timeout: 5000, // Set request timeout
  headers: { "Content-Type": "application/json" },
});


export default axios;
