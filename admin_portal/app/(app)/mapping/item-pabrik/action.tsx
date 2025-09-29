"use server";
import axiosServer from "@/lib/axiosServer";
import { FormItemDistributor, FormItemPrincipal } from "@/types/item";

const createDistributor = async (
  formData: FormItemDistributor
): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-pabrik/distributor/create",
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

const updateDistributor = async (
  formData: FormItemDistributor
): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-pabrik/distributor/update",
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

const createPrincipal = async (formData: FormItemPrincipal): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-pabrik/principal/create",
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

const updatePrincipal = async (formData: FormItemDistributor): Promise<any> => {
  try {
    var response = await axiosServer.post(
      "/api/mapping/item-pabrik/principal/update",
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

// const deleteData = async (formData: FormItemUom): Promise<any> => {
//   try {
//     var response = await axiosServer.post(
//       "/api/mapping/item-kandungan/delete",
//       formData
//     );
//     const result: string = response.data.message;
//     return {
//       success: true,
//       message: result,
//     };
//   } catch (e: any) {
//     console.log(e.response);
//     return {
//       success: false,
//       errorMessage: e.response.data.message,
//       errorData: e.response.data.errors,
//     };
//   }
// };

export {
  createDistributor,
  updateDistributor,
  createPrincipal,
  updatePrincipal,
};
