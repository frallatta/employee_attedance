"use server";
import axiosServer from "@/lib/axiosServer";
import { FormItemGroup } from "@/types/master";

const createItemGroup = async (formData: FormItemGroup): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/master/item-group/create",
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

const updateItemGroup = async (formData: FormItemGroup): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/master/item-group/update",
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

const activateItemGroup = async (formData: FormItemGroup): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/master/item-group/activate",
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

export { createItemGroup, updateItemGroup, activateItemGroup };
