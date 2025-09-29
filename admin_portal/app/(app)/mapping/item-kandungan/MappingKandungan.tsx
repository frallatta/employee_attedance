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
  FormErrorItemKandungan,
  FormErrorItemUom,
  FormItemKandungan,
  FormItemUom,
  ItemData,
  ItemKandungan,
  ItemUom,
} from "@/types/item";
import { encryptData } from "@/lib/encryption";
import { createData, updateData, deleteData } from "./action";
import { KandunganObat, Uom } from "@/types/master";
import FormInputSelect from "@/component/FormInputSelect";
import FormInputNumberfield from "@/component/FormInputNumberfield";
import { Checkbox } from "primereact/checkbox";
import { HeaderTable } from "@/component/datatable/DtHeaderTable";
import {
  DtCheckboxColumn,
  DtCheckboxColumnFilter,
} from "@/component/datatable/DtBooleanCheckbox";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const MappingKandungan = ({ kodeBarang }: { kodeBarang?: string | null }) => {
  const router = useRouter();
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    kode_kandungan: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_kandungan: { value: "", matchMode: FilterMatchMode.CONTAINS },
    satuan_kandungan: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedItemKandungan, setSelectedItemKandungan] =
    useState<ItemKandungan | null>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] =
    useState<FormItemKandungan>();
  const [uomList, setUomList] = useState<String[]>();
  const [kandunganList, setKandunganList] = useState<KandunganObat[]>();

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

  const fetcherKandungan = () =>
    axiosClient
      .get(`/api/mapping/item-kandungan/${kodeBarang}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const {
    data: dataKandungan,
    error: error,
    isLoading,
    mutate,
  } = useSWR(
    kodeBarang ? `/api/mapping/item-kandungan/${kodeBarang}` : null,
    fetcherKandungan
  );

  const updateItem = () => {
    parentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    setSelectedFormUpdate({
      kode_kandungan: selectedItemKandungan?.kode_kandungan,
      kode_barang: kodeBarang!,
      jumlah_kandungan: selectedItemKandungan?.jumlah_kandungan,
      satuan_kandungan: selectedItemKandungan?.satuan_kandungan,
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
      const formData: FormItemKandungan = {
        kode_barang: kodeBarang!,
        kode_kandungan: selectedItemKandungan?.kode_kandungan,
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
        const validateError: FormErrorItemUom = result.errorData;
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
      const responseUom = await axiosClient.get("/api/master/unit-of-measure", {
        params: {
          isActive: 1,
        },
      });
      const dataUom: Uom[] = responseUom.data;
      setUomList(dataUom.map((data) => data.satuan_uom));

      const responseKandungan = await axiosClient.get(
        "/api/master/kandungan-obat",
        {
          params: {
            isActive: 1,
          },
        }
      );
      const dataKandungan: KandunganObat[] = responseKandungan.data;
      setKandunganList(dataKandungan);
    };

    getData();
  }, []);

  return (
    <div ref={parentRef}>
      <ContextMenu
        model={menuModel}
        ref={contextMenuRef}
        onHide={() => {
          setSelectedItemKandungan(null);
        }}
      />
      {formState === "create" && (
        <ContainerCreate
          kodeBarang={kodeBarang}
          uomList={uomList}
          setFormState={setFormState}
          refreshData={mutate}
          kandunganList={kandunganList}
        />
      )}
      {formState === "update" && (
        <ContainerUpdate
          dataForm={selectedFormUpdate!}
          setFormState={setFormState}
          uomList={uomList}
          refreshData={mutate}
          kandunganList={kandunganList}
          kodeBarang={kodeBarang}
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
        contextMenuSelection={selectedItemKandungan}
        onContextMenuSelectionChange={(e: any) => {
          setSelectedItemKandungan(e.value);
        }}
        loading={isLoading}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={dataKandungan}
        filter="true"
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="id_kandungan"
        sortField="nama_kandungan"
        sortOrder={1}
      >
        <Column
          field="kode_kandungan"
          header="Kode"
          sortable
          filter
          filterPlaceholder="Search by code"
        ></Column>
        <Column
          field="nama_kandungan"
          header="Nama"
          sortable
          filter
          filterPlaceholder="Search by nama"
        ></Column>
        <Column field="jumlah_kandungan" header="Jumlah" sortable></Column>
        <Column
          field="satuan_kandungan"
          header="Satuan"
          sortable
          filter
          filterPlaceholder="Search by satuan"
        ></Column>
      </FormDatatable>
    </div>
  );
};

const ContainerCreate = function ({
  setFormState,
  refreshData,
  kodeBarang,
  uomList,
  kandunganList,
}: {
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  kodeBarang?: string | null;
  uomList?: String[];
  kandunganList?: KandunganObat[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialForm: FormItemKandungan = {
    kode_barang: kodeBarang ?? "",
    kode_kandungan: "",
    jumlah_kandungan: 0,
    satuan_kandungan: "",
  };
  const [formData, setFormData] = useState<FormItemKandungan>(initialForm);
  const [errors, setErrors] = useState<FormErrorItemKandungan>({});

  useEffect(() => {
    setFormData({
      kode_barang: kodeBarang ?? "",
      kode_kandungan: "",
      jumlah_kandungan: 0,
      satuan_kandungan: "",
    });
  }, [kodeBarang]);

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
        const validateError: FormErrorItemUom = result.errorData;
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
        kode_barang: kodeBarang ?? "",
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
          labelText="Kandungan"
          value={formData?.kode_kandungan}
          errorText={errors?.kode_kandungan}
          options={kandunganList}
          optionLabel="nama_kandungan"
          optionValue="kode_kandungan"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_kandungan: event.value,
            }));
          }}
        />
        <div className="grid gap-4 grid-cols-3">
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Jumlah Kandungan"
              value={formData.jumlah_kandungan}
              errorText={errors.jumlah_kandungan}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  jumlah_kandungan: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-2">
            <FormInputSelect
              filter={true}
              required={true}
              labelText="Satuan Kandungan"
              value={formData?.satuan_kandungan}
              errorText={errors?.satuan_kandungan}
              options={uomList}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  satuan_kandungan: event.value,
                }));
              }}
            />
          </div>
        </div>
      </form>
    </Panel>
  );
};

const ContainerUpdate = function ({
  dataForm,
  setFormState,
  refreshData,
  kodeBarang,
  uomList,
  kandunganList,
}: {
  dataForm: FormItemKandungan;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  kodeBarang?: string | null;
  uomList?: String[];
  kandunganList?: KandunganObat[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormItemKandungan>({
    kode_kandungan: "",
    kode_barang: "",
    jumlah_kandungan: 0,
    satuan_kandungan: "",
  });
  const [errors, setErrors] = useState<FormErrorItemKandungan>({});

  useEffect(() => {
    if (dataForm) {
      setFormData(dataForm);
    }
  }, [dataForm, kodeBarang]);

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
        const validateError: FormErrorItemUom = result.errorData;
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
          labelText="Kandungan"
          value={formData?.kode_kandungan}
          errorText={errors?.kode_kandungan}
          options={kandunganList}
          optionLabel="nama_kandungan"
          optionValue="kode_kandungan"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_kandungan: event.value,
            }));
          }}
        />
        <div className="grid gap-4 grid-cols-3">
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Jumlah Kandungan"
              value={formData.jumlah_kandungan}
              errorText={errors.jumlah_kandungan}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  jumlah_kandungan: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-2">
            <FormInputSelect
              filter={true}
              required={true}
              labelText="Satuan Kandungan"
              value={formData?.satuan_kandungan}
              errorText={errors?.satuan_kandungan}
              options={uomList}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  satuan_kandungan: event.value,
                }));
              }}
            />
          </div>
        </div>
      </form>
    </Panel>
  );
};

export default MappingKandungan;
