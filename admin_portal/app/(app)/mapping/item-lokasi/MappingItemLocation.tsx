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
import {
  FormErrorItemData,
  FormErrorItemLokasi,
  FormItemLokasi,
  FormItemUom,
  FormMappingItemLokasi,
  ItemData,
  ItemLokasi,
  ItemUom,
} from "@/types/item";
import { encryptData } from "@/lib/encryption";
import { createData, updateData, deleteData } from "./action";
import { KandunganObat, LokasiBarang, Site, Uom } from "@/types/master";
import FormInputSelect from "@/component/FormInputSelect";
import FormInputNumberfield from "@/component/FormInputNumberfield";
import { Checkbox } from "primereact/checkbox";
import { HeaderTable } from "@/component/datatable/DtHeaderTable";
import {
  DtCheckboxColumn,
  DtCheckboxColumnFilter,
} from "@/component/datatable/DtBooleanCheckbox";
import FormInputSwitch from "@/component/FormInputSwitch";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const MappingItemLocation = ({
  templateType = "ITEM_TO_LOCATION",
  kodeBarang = "",
  kodeLokasi = "",
}: {
  templateType: FormMappingItemLokasi;
  kodeBarang?: string | null;
  kodeLokasi?: string | null;
}) => {
  const router = useRouter();
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    nama_site: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_lokasi_barang: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_barang: { value: "", matchMode: FilterMatchMode.CONTAINS },
    is_set_fix_stock: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedItemLokasi, setSelectedItemLokasi] =
    useState<ItemLokasi | null>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] =
    useState<FormItemLokasi>();

  const [itemList, setItemList] = useState<ItemData[]>();
  const [siteList, setSiteList] = useState<Site[]>();
  const [lokasiBarangList, setLokasiBarangList] = useState<LokasiBarang[]>();

  const parentRef = useRef<HTMLDivElement>(null);

  const contextMenuRef = useRef<ContextMenu>(null);
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
      label: "Delete",
      icon: "pi pi-trash",
      command: () => confirmDelete(),
    },
    // {
    //   label: selectedDataRow?.active_item ? "Deactive" : "Active",
    //   icon: selectedDataRow?.active_item ? "pi pi-times" : "pi pi-check",
    //   command: () => confirmActivate(),
    // },
    //   ],
    // },
  ];

  const fetcherItemLocation = async () => {
    var params = {
      kode_barang: kodeBarang,
      kode_lokasi: kodeLokasi,
    };
    return axiosClient
      .get(`/api/mapping/item-lokasi`, {
        params: params,
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const {
    data: dataKandungan,
    error: error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    kodeBarang || kodeLokasi ? `/api/mapping/item-lokasi` : null,
    fetcherItemLocation
  );

  const updateItem = () => {
    parentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    setSelectedFormUpdate({
      site_id: selectedItemLokasi?.site_id,
      kode_barang: selectedItemLokasi?.kode_barang,
      kode_lokasi: selectedItemLokasi?.kode_lokasi,
      fix_stock: selectedItemLokasi?.fix_stock,
      is_set_fix_stock: selectedItemLokasi?.is_set_fix_stock,
    });

    setFormState("update");
  };

  const confirmDelete = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteItem,
    });
  };

  const deleteItem = async () => {
    setLayoutLoading(true);
    try {
      const formData: FormItemLokasi = {
        site_id: selectedItemLokasi?.site_id,
        kode_barang: selectedItemLokasi?.kode_barang,
        kode_lokasi: selectedItemLokasi?.kode_lokasi,
      };

      const result = await deleteData(formData);
      setLayoutLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        mutate();
      } else {
        const validateError: FormErrorItemLokasi = result.errorData;
        if (validateError.message) {
          toastRef.current.show({
            severity: "error",
            summary: "Failed",
            detail: result.errorMessage,
          });
        }
        return;
      }
    } catch (e: any) {
      setLayoutLoading(false);
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: e.message,
      });
    }
  };

  useEffect(() => {
    const getData = async () => {
      const responseSite = await axiosClient.get("/api/master/site", {
        params: {
          isActive: 1,
        },
      });
      const dataSite: Site[] = responseSite.data;
      setSiteList(dataSite);

      if (templateType === "ITEM_TO_LOCATION") {
        const responseLokasiBarang = await axiosClient.get(
          "/api/master/lokasi-barang",
          {
            params: {
              isActive: 1,
            },
          }
        );
        const dataLokasiBarang: LokasiBarang[] = responseLokasiBarang.data;
        setLokasiBarangList(dataLokasiBarang);
      } else if (templateType === "LOCATION_TO_ITEM") {
        const responseItem = await axiosClient.get("/api/master/item", {
          params: {
            isActive: 1,
          },
        });
        const dataItem: ItemData[] = responseItem.data;
        setItemList(dataItem);
      }
    };

    getData();
  }, [templateType]);

  useEffect(() => {
    mutate();
  }, [kodeBarang, kodeLokasi, mutate]);

  return (
    <div ref={parentRef}>
      <ContextMenu
        model={menuModel}
        ref={contextMenuRef}
        onHide={() => {
          setSelectedItemLokasi(null);
        }}
      />
      {formState === "create" && (
        <ContainerCreate
          templateType={templateType}
          kodeBarang={kodeBarang!}
          kodeLokasiBarang={kodeLokasi!}
          siteList={siteList}
          itemList={itemList}
          lokasiBarangList={lokasiBarangList}
          setFormState={setFormState}
          refreshData={mutate}
        />
      )}
      {formState === "update" && (
        <ContainerUpdate
          dataForm={selectedFormUpdate!}
          setFormState={setFormState}
          refreshData={mutate}
          templateType={templateType}
          siteList={siteList}
          itemList={itemList}
          lokasiBarangList={lokasiBarangList}
        />
      )}
      {formState === null && (
        <div className="flex justify-end mb-2">
          <FormButton
            labelText="Create"
            onClick={() => setFormState("create")}
          />
        </div>
      )}
      <FormDatatable
        //header={HeaderTable({ headerTitle: "Item Kandungan" })}
        className="mt-4"
        onContextMenu={(e: any) =>
          contextMenuRef.current?.show(e.originalEvent)
        }
        contextMenuSelection={selectedItemLokasi}
        onContextMenuSelectionChange={(e: any) => {
          setSelectedItemLokasi(e.value);
        }}
        loading={isLoading || isValidating}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={dataKandungan}
        filter="true"
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="id_lokasi_barang"
        sortField="nama_site"
        sortOrder={1}
      >
        <Column
          field="nama_site"
          header="Site"
          sortable
          filter
          filterPlaceholder="Search by site"
        ></Column>
        {templateType === "ITEM_TO_LOCATION" && (
          <Column
            field="nama_lokasi_barang"
            header="Lokasi"
            sortable
            filter
            filterPlaceholder="Search by lokasi"
          ></Column>
        )}
        {templateType === "LOCATION_TO_ITEM" && (
          <Column
            field="nama_barang"
            header="Item"
            sortable
            filter
            filterPlaceholder="Search by item"
          ></Column>
        )}
        <Column field="fix_stock" header="Fix Stock" sortable></Column>
        <Column
          dataType="boolean"
          body={(data: ItemLokasi) => DtCheckboxColumn(data.is_set_fix_stock)}
          field="is_set_fix_stock"
          header="Set Fix Stock"
          filterElement={DtCheckboxColumnFilter}
          filter
          filterPlaceholder="Search by set fix stock"
        ></Column>
      </FormDatatable>
    </div>
  );
};

const ContainerCreate = function ({
  setFormState,
  refreshData,
  kodeBarang,
  kodeLokasiBarang,
  templateType,
  siteList,
  itemList,
  lokasiBarangList,
}: {
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  kodeBarang?: string;
  kodeLokasiBarang?: string;
  templateType: FormMappingItemLokasi;
  siteList?: Site[];
  itemList?: ItemData[];
  lokasiBarangList?: LokasiBarang[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialForm: FormItemLokasi = {
    kode_barang: "",
    kode_lokasi: "",
    site_id: "",
    fix_stock: 0,
    is_set_fix_stock: false,
  };
  const [formData, setFormData] = useState<FormItemLokasi>(initialForm);
  const [errors, setErrors] = useState<FormErrorItemLokasi>({});

  useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      kode_lokasi: kodeLokasiBarang,
      kode_barang: kodeBarang,
    }));
  }, [kodeBarang, kodeLokasiBarang]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result = await createData(formData);
      setLayoutLoading(false);
      setLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        refreshData();
      } else {
        const validateError: FormErrorItemLokasi = result.errorData;
        setErrors(validateError);
        if (validateError.message) {
          toastRef.current.show({
            severity: "error",
            summary: "Failed",
            detail: result.errorMessage,
          });
        }
        return;
      }

      setFormData({
        ...initialForm,
        kode_lokasi: kodeLokasiBarang,
        kode_barang: kodeBarang,
      });
    } catch (e: any) {
      setLoading(false);
      setLayoutLoading(false);
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: e.message,
      });
    }
  };

  const footerTemplate = (options: any) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <FormButton
            labelText="Close"
            severity="secondary"
            onClick={(e: any) => {
              e.preventDefault();
              setFormState(null);
            }}
          />
          <FormButton
            type="submit"
            form="form-create"
            loading={loading}
            labelText="Submit"
          />
        </div>
      </div>
    );
  };

  return (
    <Panel header="Create" footerTemplate={footerTemplate}>
      <form
        className="flex flex-col gap-2"
        onSubmit={formSubmit}
        id="form-create"
      >
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Site"
          value={formData?.site_id}
          errorText={errors?.site_id}
          options={siteList}
          optionLabel="nama_site"
          optionValue="site_id"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              site_id: event.value,
            }));
          }}
        />
        {templateType === "ITEM_TO_LOCATION" && (
          <FormInputSelect
            required={true}
            filter="true"
            labelText="Lokasi"
            value={formData?.kode_lokasi}
            errorText={errors?.kode_lokasi}
            options={lokasiBarangList}
            optionLabel="nama_lokasi_barang"
            optionValue="kode_lokasi_barang"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_lokasi: event.value,
              }));
            }}
          />
        )}
        {templateType === "LOCATION_TO_ITEM" && (
          <FormInputSelect
            required={true}
            filter="true"
            labelText="Item"
            value={formData?.kode_barang}
            errorText={errors?.kode_barang}
            options={itemList}
            optionLabel="nama_barang"
            optionValue="kode_barang"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_barang: event.value,
              }));
            }}
          />
        )}
        <FormInputNumberfield
          labelText="Fix Stock"
          value={formData.fix_stock}
          errorText={errors.fix_stock}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              fix_stock: event.value,
            }));
          }}
        />
        <FormInputSwitch
          labelText="Set Fix Stock"
          errorText={errors.is_set_fix_stock}
          checkedValue={formData.is_set_fix_stock!}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              is_set_fix_stock: event.value,
            }));
          }}
        />
      </form>
    </Panel>
  );
};

const ContainerUpdate = function ({
  dataForm,
  setFormState,
  refreshData,
  templateType,
  siteList,
  itemList,
  lokasiBarangList,
}: {
  dataForm: FormItemLokasi;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  templateType: FormMappingItemLokasi;
  siteList?: Site[];
  itemList?: ItemData[];
  lokasiBarangList?: LokasiBarang[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormItemLokasi>({
    kode_lokasi: "",
    kode_barang: "",
    fix_stock: 0,
    site_id: "",
    is_set_fix_stock: false,
  });
  const [errors, setErrors] = useState<FormErrorItemLokasi>({});

  useEffect(() => {
    if (dataForm) {
      setFormData(dataForm);
    }
  }, [dataForm]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result = await updateData(formData);
      setLayoutLoading(false);
      setLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        refreshData();
      } else {
        const validateError: FormErrorItemLokasi = result.errorData;
        setErrors(validateError);
        if (validateError.message) {
          toastRef.current.show({
            severity: "error",
            summary: "Failed",
            detail: result.errorMessage,
          });
        }
        return;
      }

      setFormState(null);
    } catch (e: any) {
      setLoading(false);
      setLayoutLoading(false);
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: e.message,
      });
    }
  };

  const footerTemplate = (options: any) => {
    const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <FormButton
            labelText="Close"
            filter="true"
            severity="secondary"
            onClick={(e: any) => {
              e.preventDefault();
              setFormState(null);
            }}
          />
          <FormButton
            type="submit"
            form="form-update"
            labelText="Submit"
            loading={loading}
          />
        </div>
      </div>
    );
  };

  return (
    <Panel header="Update" footerTemplate={footerTemplate}>
      <form
        className="flex flex-col gap-2"
        onSubmit={formSubmit}
        id="form-update"
      >
        <FormInputSelect
          disabled={true}
          required={true}
          filter="true"
          labelText="Site"
          value={formData?.site_id}
          errorText={errors?.site_id}
          options={siteList}
          optionLabel="nama_site"
          optionValue="site_id"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              site_id: event.value,
            }));
          }}
        />
        {templateType === "ITEM_TO_LOCATION" && (
          <FormInputSelect
            disabled={true}
            required={true}
            filter="true"
            labelText="Lokasi"
            value={formData?.kode_lokasi}
            errorText={errors?.kode_lokasi}
            options={lokasiBarangList}
            optionLabel="nama_lokasi_barang"
            optionValue="kode_lokasi_barang"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_lokasi: event.value,
              }));
            }}
          />
        )}
        {templateType === "LOCATION_TO_ITEM" && (
          <FormInputSelect
            required={true}
            disabled={true}
            filter="true"
            labelText="Item"
            value={formData?.kode_barang}
            errorText={errors?.kode_barang}
            options={itemList}
            optionLabel="nama_barang"
            optionValue="kode_barang"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_barang: event.value,
              }));
            }}
          />
        )}
        <FormInputNumberfield
          labelText="Fix Stock"
          value={formData.fix_stock}
          errorText={errors.fix_stock}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              fix_stock: event.value,
            }));
          }}
        />
        <FormInputSwitch
          labelText="Set Fix Stock"
          errorText={errors.is_set_fix_stock}
          checkedValue={formData.is_set_fix_stock!}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              is_set_fix_stock: event.value,
            }));
          }}
        />
      </form>
    </Panel>
  );
};

export default MappingItemLocation;
