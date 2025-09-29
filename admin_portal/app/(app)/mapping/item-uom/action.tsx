"use server";
import axiosServer from "@/lib/axiosServer";
import { FormItemUom } from "@/types/item";

const createUomJual = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-uom/jual/create",
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

const createUomBeli = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-uom/beli/create",
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

const updateUomJual = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-uom/jual/update",
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

const updateUomBeli = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-uom/beli/update",
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

const deleteUomJual = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-uom/jual/delete",
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

const deleteUomBeli = async (formData: FormItemUom): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-uom/beli/delete",
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

export {
  createUomJual,
  createUomBeli,
  updateUomBeli,
  updateUomJual,
  deleteUomJual,
  deleteUomBeli,
};
