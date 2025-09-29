"use server";
import axiosServer from "@/lib/axiosServer";
import { FormItemUom } from "@/types/item";

const createData = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-kandungan/create",
      formData
    );
    const result: string = response.data.message;
    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    return {
      success: false,
      errorMessage: e.response.data.message,
      errorData: e.response.data.errors,
    };
  }
};


const updateData = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-kandungan/update",
      formData
    );
    const result: string = response.data.message;
    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    return {
      success: false,
      errorMessage: e.response.data.message,
      errorData: e.response.data.errors,
    };
  }
};

const deleteData = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-kandungan/delete",
      formData
    );
    const result: string = response.data.message;
    return {
      success: true,
      message: result,
    };
  } catch (e: any) {
    console.log(e.response);
    return {
      success: false,
      errorMessage: e.response.data.message,
      errorData: e.response.data.errors,
    };
  }
};


export {
  createData,
  updateData,
  deleteData
};
