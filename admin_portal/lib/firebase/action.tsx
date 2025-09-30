"use server";

import { Employee } from "@/types/employee";
import axiosServer from "../axiosServer";
import { errorRequestHandler } from "../utils";

const saveToken = async (token: string) => {
  try {
    const resEmployeeData = await axiosServer.get("/auth/profile");
    const profileData: Employee = resEmployeeData.data;
    const formData = {
      fcm_token: token,
    };
    var response = await axiosServer.put(
      `/employees/${profileData.id}`,
      formData
    );
    const result: string = response.data.message;

    const subscribeFormData = {
      token: token,
      topic: "emp_update_data",
    };
    await axiosServer.post("/firebase/subscribe", subscribeFormData);

    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    return errorRequestHandler(e);
  }
};

export { saveToken };
