"use server";
import axiosServer from "@/lib/axiosServer";
import { FormBukuTarif, FormBukuTarifDetail } from "@/types/buku-tarif";
import { FormItemUom } from "@/types/item";

const createBukuTarif = async (formData: FormBukuTarif): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/buku-tarif/create",
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

const updateBukuTarif = async (formData: FormBukuTarif): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/buku-tarif/update",
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

const createBukuTarifDetail = async (
  formData: FormBukuTarifDetail
): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/buku-tarif/detail/create",
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

const updateBukuTarifDetail = async (
  formData: FormBukuTarifDetail
): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/buku-tarif/detail/update",
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
  createBukuTarif,
  updateBukuTarif,
  createBukuTarifDetail,
  updateBukuTarifDetail,
};
