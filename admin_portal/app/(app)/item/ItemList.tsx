"use client";

import { useContext, useEffect, useRef, useState } from "react";

import useSWR, { KeyedMutator } from "swr";
import FormDatatable from "@/component/FormDatatable";
import { Column } from "primereact/column";
import axiosClient from "@/lib/axiosClient";
import FormInputText from "@/component/FormInputText";
import FormButton from "@/component/FormButton";

import { Dispatch, SetStateAction } from "react";
import { Panel } from "primereact/panel";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { FilterMatchMode } from "primereact/api";
import { DataTableFilterMeta, DataTableStateEvent } from "primereact/datatable";
import {
  DtBooleanColumn,
  DtBooleanColumnFilter,
} from "@/component/datatable/DtBooleanColumn";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import { useRouter } from "next/navigation";
import { FormErrorItemData, ItemData } from "@/types/item";
import { activateItem } from "./action";
import { encryptData } from "@/lib/encryption";
import {
  DtCheckboxColumn,
  DtCheckboxColumnFilter,
} from "@/component/datatable/DtBooleanCheckbox";
import MappingUom from "./uom/MappingUom";
import { Divider } from "primereact/divider";
import MappingKandungan from "./kandungan/MappingKandungan";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const ItemListTemplate = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    kode_barang: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_barang: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_bentuk: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_group: { value: "", matchMode: FilterMatchMode.CONTAINS },
    discontinued: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedDataRow, setSelectedDataRow] = useState<ItemData | null>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] = useState<ItemData>();
  const contextMenuRef = useRef<ContextMenu>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [selectedAction, setSelectedAction] = useState<String | null>(null);
  const [selectedMappingItem, setSelectedMappingItem] = useState<ItemData | null>(
    null
  );
  const mappingRef = useRef<HTMLDivElement>(null);

  const menuModel: MenuItem[] = [
    // {
    //   label: "Action",
    //   items: [
    {
      label: "Update",
      icon: "pi pi-pen-to-square",
      command: () => updateItem(),
    },
    {
      label: "Satuan Hitung",
      icon: "pi pi-objects-column",
      command: () => mappingUom(),
    },
        {
      label: "Kandungan",
      icon: "pi pi-objects-column",
      command: () => mappingKandungan(),
    },
    {
      label: selectedDataRow?.is_active ? "Discontinued" : "Active",
      icon: selectedDataRow?.is_active ? "pi pi-times" : " pi pi-check",
      command: () => confirmActivate(),
    },
    //   ],
    // },
  ];

  const fetcherDataItem = () =>
    axiosClient
      .get("/api/master/item")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const { data, error, isLoading, mutate } = useSWR(
    "/api/master/item",
    fetcherDataItem
  );

  const activateStatus = async () => {
    if (selectedDataRow) {
      setLayoutLoading(true);
      try {
        // const formData: FormItemData = {
        //   kode_kandungan: selectedDataRow?.kode_kandungan,
        // };
        // var response = await axiosClient.post(
        //   "/api/master/kandungan-obat/activate",
        //   formData
        // );
        const result = await activateItem(selectedDataRow);
        setLayoutLoading(false);
        if (result.success) {
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: result.message,
          });
          mutate();
        } else {
          const validateError: FormErrorItemData = result.errorData;
          if (validateError.message) {
            toastRef.current.show({
              severity: "error",
              summary: "Failed",
              detail: result.errorMessage,
            });
          }
        }
      } catch (e: any) {
        setLayoutLoading(false);
        toastRef.current.show({
          severity: "error",
          summary: "Failed",
          detail: e.message,
        });
      }
    }
  };

  const updateItem = () => {
    var encryptedData = encryptData(selectedDataRow?.kode_barang!);
    const url = encodeURIComponent(encryptedData);
    router.push(`/master/item/${url}/update`);
  };

  const mappingUom = () => {
    setSelectedMappingItem(selectedDataRow);
    setSelectedAction("MAPPING_UOM");

    mappingRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const mappingKandungan = () => {
    setSelectedMappingItem(selectedDataRow);
    setSelectedAction("MAPPING_KANDUNGAN");

    mappingRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const confirmActivate = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: activateStatus,
    });
  };

  return (
    <div ref={parentRef}>
      <ContextMenu
        model={menuModel}
        ref={contextMenuRef}
        onHide={() => setSelectedDataRow(null)}
      />
      <div className="flex justify-end mb-2">
        <FormButton
          labelText="Create"
          onClick={() => {
            router.push("/master/item/create");
          }}
        />
      </div>
      <FormDatatable
        className="mt-4"
        onContextMenu={(e: any) =>
          contextMenuRef.current?.show(e.originalEvent)
        }
        contextMenuSelection={selectedDataRow}
        onContextMenuSelectionChange={(e: any) => setSelectedDataRow(e.value)}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={data}
        filter="true"
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="kode_barang"
        sortField="nama_barang"
        sortOrder={1}
      >
        {/* <Column
          field="kode_barang"
          header="Kode"
          sortable
          filter
          filterPlaceholder="Search by code"
        ></Column> */}
        <Column
          field="nama_barang"
          header="Nama"
          sortable
          filter
          filterPlaceholder="Search by name"
        ></Column>
        <Column
          field="nama_bentuk"
          header="Bentuk"
          sortable
          filter
          filterPlaceholder="Search by bentuk"
        ></Column>
        <Column
          field="nama_group"
          header="Grup"
          sortable
          filter
          filterPlaceholder="Search by group"
        ></Column>
        <Column
          dataType="boolean"
          field="is_active"
          header="Discontinued"
          body={(rowData: ItemData) => DtCheckboxColumn(!rowData.is_active)}
          filter
          filterElement={DtCheckboxColumnFilter}
        ></Column>
      </FormDatatable>

      {selectedAction && (
        <>
          <FormButton
            labelText="Close"
            severity="secondary"
            classNames="mt-8"
            onClick={() => {
              setSelectedAction(null);
            }}
          />
          <div className="border border-gray-200 rounded  mt-2 p-4" ref={mappingRef}>
            <div>
              <p className="text-xl font-medium !my-0">{selectedMappingItem?.nama_group} - {selectedMappingItem?.nama_barang} </p>
              {/* <p>{selectedMappingItem?.nama_bentuk}</p> */}
            </div>
            <Divider/>
            {selectedAction == "MAPPING_KANDUNGAN" && (            <>
              <div className="flex justify-between mb-2">
                <p className="text-lg font-medium">Kandungan Barang</p>
                {/* <FormButton labelText="Close" /> */}
              </div>
              <MappingKandungan kodeBarang={selectedMappingItem?.kode_barang} />
            </>)}
            {selectedAction == "MAPPING_UOM" && (            <>
              <div className="flex justify-between mb-2">
                <p className="text-lg font-medium">Mapping UOM</p>
                {/* <FormButton labelText="Close" /> */}
              </div>
              <MappingUom kodeBarang={selectedMappingItem?.kode_barang} />
            </>)}

          </div>
        </>
      )}
    </div>
  );
};

export default ItemListTemplate;
