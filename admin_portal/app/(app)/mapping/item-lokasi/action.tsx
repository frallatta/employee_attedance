"use server";
import axiosServer from "@/lib/axiosServer";
import { FormItemLokasi } from "@/types/item";

const createData = async (formData: FormItemLokasi): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-lokasi/create",
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


const updateData = async (formData: FormItemLokasi): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-lokasi/update",
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

const deleteData = async (formData: FormItemLokasi): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-lokasi/delete",
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
