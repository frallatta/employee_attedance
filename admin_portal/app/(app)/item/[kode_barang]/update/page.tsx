import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import FormUpdateItem from "./FormUpdate";
import {
  BentukObat,
  DosisObat,
  EfekSamping,
  GolonganProduksi,
  ItemGroup,
  KategoriObat,
  KontraIndikasi,
} from "@/types/master";
import { FormOptionList, ItemData } from "@/types/item";
import { getOptionData, getItemData } from "./action";
import { decryptData } from "@/lib/encryption";

const UpdateItemPage = async ({params}:{params: any}) => {

    const encryptedData = (await params).kode_barang;
    const encryptedKodeBarang = decodeURIComponent(encryptedData);
    const kodeBarang = decryptData(encryptedKodeBarang);

    const itemData:ItemData = await getItemData(kodeBarang);
  const optionData:FormOptionList = await getOptionData();

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Pembaruan Data Barang</h5>
          <FormUpdateItem optionData={optionData} itemData={itemData}/>
        </div>
      </div>
    </div>
  );
};

export default UpdateItemPage;
