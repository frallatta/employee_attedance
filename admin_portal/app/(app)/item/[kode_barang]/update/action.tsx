"use server";
import axiosServer from "@/lib/axiosServer";
import { FormItemData, FormOptionList, ItemData } from "@/types/item";
import {
  BentukObat,
  DosisObat,
  EfekSamping,
  GolonganProduksi,
  ItemGroup,
  KategoriObat,
  KontraIndikasi,
} from "@/types/master";

const getOptionData = async (): Promise<FormOptionList> => {
  const resItemGroup = await axiosServer.get("/api/master/item-group", {
    params: {
      isActive: 1,
    },
  });
  const itemGroupList: ItemGroup[] = resItemGroup.data;

  const resBentukObat = await axiosServer.get("/api/master/bentuk", {
    params: {
      isActive: 1,
    },
  });
  const bentukObatList: BentukObat[] = resBentukObat.data;

  const resKontraIndikasi = await axiosServer.get(
    "/api/master/kontra-indikasi",
    {
      params: {
        isActive: 1,
      },
    }
  );
  const kontraIndikasiList: KontraIndikasi[] = resKontraIndikasi.data;

  const resKategoriObat = await axiosServer.get("/api/master/kategori-obat", {
    params: {
      isActive: 1,
    },
  });
  const kategoriObatList: KategoriObat[] = resKategoriObat.data;

  const resEfekSamping = await axiosServer.get("/api/master/efek-samping", {
    params: {
      isActive: 1,
    },
  });
  const efekSampingList: EfekSamping[] = resEfekSamping.data;

  const resGolonganProduksi = await axiosServer.get(
    "/api/master/golongan-produksi",
    {
      params: {
        isActive: 1,
      },
    }
  );
  const golonganProduksiList: GolonganProduksi[] = resGolonganProduksi.data;

  const resDosisObat = await axiosServer.get("/api/master/dosis-obat", {
    params: {
      isActive: 1,
    },
  });
  const dosisObatList: DosisObat[] = resDosisObat.data;

  const optionData: FormOptionList = {
    itemGroupList: itemGroupList,
    bentukObatList: bentukObatList,
    kontraIndikasiList: kontraIndikasiList,
    kategoriObatList: kategoriObatList,
    efekSampingList: efekSampingList,
    golonganProduksiList: golonganProduksiList,
    dosisObatList: dosisObatList,
  };

  return optionData;
};

const getItemData = async (kodeBarang:string): Promise<ItemData> => {
  const resItemGroup = await axiosServer.get(`/api/master/item/kode/${kodeBarang}`);
  const itemData: ItemData = resItemGroup.data;

  return itemData;
};

const updateItem = async (formData: FormItemData): Promise<any> => {
  try {
    var response = await axiosServer.post("/api/master/item/update", formData);
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

export {getItemData, getOptionData, updateItem };
