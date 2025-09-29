"use client";

import { useContext, useEffect, useRef, useState } from "react";

import useSWR, { KeyedMutator } from "swr";
import FormDatatable from "@/component/FormDatatable";
import { Column } from "primereact/column";
import axiosClient from "@/lib/axiosClient";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { FilterMatchMode } from "primereact/api";
import { DataTableFilterMeta, DataTableStateEvent } from "primereact/datatable";
import { ContextMenu } from "primereact/contextmenu";
import { useRouter } from "next/navigation";
import { FormErrorItemData, ItemData } from "@/types/item";
import { Divider } from "primereact/divider";
import MappingItemLocation from "../MappingItemLocation";
import { LokasiBarang } from "@/types/master";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const LocationToItem = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    kode_barang: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_barang: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_bentuk: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_group: { value: "", matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedDataRow, setSelectedDataRow] = useState<LokasiBarang | null>(
    null
  );
  const contextMenuRef = useRef<ContextMenu>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const mappingRef = useRef<HTMLDivElement>(null);

  const fetcherDataItem = () =>
    axiosClient
      .get("/api/master/lokasi-barang", {
        params: {
          isActive: 1,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const { data, error, isLoading, mutate } = useSWR(
    "/api/master/lokasi/barang",
    fetcherDataItem
  );

  return (
    <div ref={parentRef}>
      <FormDatatable
        className="mt-4"
        selectionMode="single"
        selection={selectedDataRow}
        onSelectionChange={(e: any) => setSelectedDataRow(e.value)}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={data}
        filter="true"
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="kode_lokasi_barang"
        sortField="nama_lokasi_barang"
        sortOrder={1}
      >
        <Column
          field="kode_lokasi_barang"
          header="Kode"
          sortable
          filter
          filterPlaceholder="Search by code"
        ></Column>
        <Column
          field="nama_lokasi_barang"
          header="Nama"
          sortable
          filter
          filterPlaceholder="Search by nama"
        ></Column>
      </FormDatatable>

      {selectedDataRow && (
        <>
          <div
            className="border border-gray-200 rounded  mt-2 p-4"
            ref={mappingRef}
          >
            <div>
              <p className="text-xl font-medium !my-0">
                {selectedDataRow?.kode_lokasi_barang} -{" "}
                {selectedDataRow?.nama_lokasi_barang}{" "}
              </p>
              {/* <p>{selectedMappingItem?.nama_bentuk}</p> */}
            </div>
            <Divider />
            <>
              <div className="flex justify-between mb-2">
                <p className="text-lg font-medium">Item List</p>
                {/* <FormButton labelText="Close" /> */}
              </div>
            </>
            <>
              <MappingItemLocation
                templateType="LOCATION_TO_ITEM"
                kodeLokasi={selectedDataRow.kode_lokasi_barang}
              />
            </>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationToItem;
