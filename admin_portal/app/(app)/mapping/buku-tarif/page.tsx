import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import BukuTarifTemplate from "./BukuTarif";

const BukuTarifPage = async () => {
  const resBukuTarif = await axiosServer.get(
    "/api/mapping/buku-tarif"
    //   {
    //   params: {
    //     isActive: 1,
    //   },
    // }
  );
  const listBukuTarif = resBukuTarif.data;

  const resCompany = await axiosServer.get("/api/master/company", {
    params: {
      isActive: 1,
    },
  });
  const companyList = resCompany.data;

  const resItemData = await axiosServer.get("/api/master/item", {
    params: {
      isActive: 1,
    },
  });
  const itemDataList = resItemData.data;

  const resKelasTarif = await axiosServer.get("/api/master/kelas-tarif", {
    params: {
      isActive: 1,
    },
  });

  const kelasTarifList = resKelasTarif.data;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Mapping Buku Tarif</h5>
          <SWRConfig
            value={{
              fallback: { "/api/mapping/buku-tarif": listBukuTarif },
            }}
          >
            <BukuTarifTemplate
              companyList={companyList}
              itemDataList={itemDataList}
              kelasTarifList={kelasTarifList}
            />
          </SWRConfig>
        </div>
      </div>
    </div>
  );
};

export default BukuTarifPage;
