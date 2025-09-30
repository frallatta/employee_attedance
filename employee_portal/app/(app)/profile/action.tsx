"use server";
import axiosServer from "@/lib/axiosServer";
import { errorRequestHandler } from "@/lib/utils";

const changePhoneNumber = async (
  employeeId: number,
  phoneNumber: string
): Promise<any> => {
  try {
    const formData = {
      phone_number: phoneNumber,
      is_employee_request: "true",
    };
    var response = await axiosServer.put(`/employees/${employeeId}`, formData);
    const result: string = response.data.message;
    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    return errorRequestHandler(e);
  }
};

const changePassword = async (
  employeeId: number,
  currentPassword: string,
  newPassword: string
): Promise<any> => {
  try {
    const formData = {
      current_password: currentPassword,
      new_password: newPassword,
    };
    var response = await axiosServer.put(
      `/employees/${employeeId}/change-password`,
      formData
    );
    const result: string = response.data.message;
    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    return errorRequestHandler(e);
  }
};

const changeImage = async (
  employeeId: number,
  formData: FormData
): Promise<any> => {
  try {
    var response = await axiosServer.put(
      `/employees/${employeeId}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const result: string = response.data.message;
    console.log(result);
    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    console.log(e.response);
    return errorRequestHandler(e);
  }
};

export { changeImage, changePassword, changePhoneNumber };
