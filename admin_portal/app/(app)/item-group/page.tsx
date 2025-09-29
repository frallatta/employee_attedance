import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import ItemGroupPageTemplate from "./item-group/ItemGroup";

const ItemGroupPage = async () => {
  const resItemGroup = await axiosServer.get("/api/master/item-group");
  const dataItemGroup = resItemGroup.data;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Konfigurasi Kelompok Barang</h5>
          <Accordion activeIndex={0}>
            <AccordionTab header="Kelompok Barang">
              <SWRConfig
                value={{
                  fallback: { "/api/master/item-group": dataItemGroup },
                }}
              >
                <ItemGroupPageTemplate />
              </SWRConfig>
            </AccordionTab>
            {/* <AccordionTab header="Mapping Satuan Hitung (UOM)">
              Ini Mapping UOM yah
            </AccordionTab> */}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ItemGroupPage;
