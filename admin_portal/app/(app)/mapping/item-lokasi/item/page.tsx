import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import ItemToLocation from "./ItemToLocation";

const ItemLokasiPage = async () => {
  const resItemData = await axiosServer.get("/api/master/item", {
    params: {
      isActive: 1,
    },
  });
  const listItemData = resItemData.data;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Barang ke Lokasi</h5>
          <SWRConfig
            value={{
              fallback: { "/api/master/item": listItemData },
            }}
          >
            <ItemToLocation />
          </SWRConfig>
        </div>
      </div>
    </div>
  );
};

export default ItemLokasiPage;
