import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import axiosServer from "@/lib/axiosServer";

import "primeicons/primeicons.css";
import { SWRConfig } from "swr";
import EmployeeTemplate from "./EmployeeList";

const EmployeePage = async () => {
  const resEmployeeData = await axiosServer.get("/employees/");
  const listEmployeeData = resEmployeeData.data;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-12">
        <div className="card">
          <h5>Employee Data</h5>
          <SWRConfig
            value={{
              fallback: { "/employee": listEmployeeData },
            }}
          >
            <EmployeeTemplate />
          </SWRConfig>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
