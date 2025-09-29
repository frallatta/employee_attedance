import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import FormCreateItem from "./FormCreate";
import {
  BentukObat,
  DosisObat,
  EfekSamping,
  GolonganProduksi,
  ItemGroup,
  KategoriObat,
  KontraIndikasi,
} from "@/types/master";
import { FormOptionList } from "@/types/item";
import { getOptionData } from "./action";

const ItemGroupPage = async () => {

  const optionData:FormOptionList = await getOptionData();

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Tambah Data Barang</h5>
          <FormCreateItem optionData={optionData}/>
        </div>
      </div>
    </div>
  );
};

export default ItemGroupPage;
