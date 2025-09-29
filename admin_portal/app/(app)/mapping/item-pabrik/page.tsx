import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import ItemPabrik from "./ItemPabrik";
import { Distributor, Principal } from "@/types/master";

const ItemPabrikPage = async () => {
  const resItemData = await axiosServer.get("/api/master/item", {
    params: {
      isActive: 1,
    },
  });
  const listItemData = resItemData.data;

  const resDistributor = await axiosServer.get("/api/master/distributor", {
    params: {
      is_active: 1,
    },
  });
  const distributorList: Distributor[] = resDistributor.data;

  const resPrincipal = await axiosServer.get("/api/master/principal", {
    params: {
      is_active: 1,
    },
  });
  const principalList: Principal[] = resPrincipal.data;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Mapping Pabrik Barang</h5>
          <SWRConfig
            value={{
              fallback: { "/api/mapping/item-pabrik": listItemData },
            }}
          >
            <ItemPabrik
              distributorList={distributorList}
              principalList={principalList}
            />
          </SWRConfig>
        </div>
      </div>
    </div>
  );
};

export default ItemPabrikPage;
