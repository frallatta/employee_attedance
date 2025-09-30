"use server";
import axiosServer from "@/lib/axiosServer";
import { errorRequestHandler } from "@/lib/utils";
import { FormEmployee } from "@/types/employee";

const createEmployee = async (formData: FormEmployee): Promise<any> => {
  try {
    var response = await axiosServer.post("/employees", formData);
    const result: string = response.data.message;
    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    return errorRequestHandler(e);
  }
};

const updateEmployee = async (
  employeeId: number,
  formData: FormEmployee
): Promise<any> => {
  try {
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

const updateEmployeeImage = async (
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

export { createEmployee, updateEmployee, updateEmployeeImage };
