"use server";
import axios from "@/lib/axios";
import { errorRequestHandler } from "@/lib/utils";
import { FormLogin } from "@/types/auth";
import { signIn } from "next-auth/react";

const login = async (formData: FormLogin): Promise<any> => {
  try {
    const dataForm = {
      ...formData,
      is_login_admin: true,
    };
    var response = await axios.post(`/auth/login`, dataForm);
    const result: string = response.data.message;

    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    return errorRequestHandler(e);
  }
};

export { login };
