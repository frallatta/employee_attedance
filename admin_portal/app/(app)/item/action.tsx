"use server";
import axiosServer from "@/lib/axiosServer";
import { FormItemData, FormOptionList, ItemData } from "@/types/item";


const activateItem = async (ItemData: ItemData): Promise<any> => {
  try {

    var formData = {
        kode_barang: ItemData.kode_barang
    }

    var response = await axiosServer.post("/api/master/item/activate", formData);
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

export { activateItem };
