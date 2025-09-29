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
  FormErrorItemUom,
  FormItemUom,
  ItemData,
  ItemUom,
} from "@/types/item";
import { encryptData } from "@/lib/encryption";
import {
  createUomBeli,
  createUomJual,
  deleteUomBeli,
  deleteUomJual,
  updateUomBeli,
  updateUomJual,
} from "./action";
import { Uom } from "@/types/master";
import FormInputSelect from "@/component/FormInputSelect";
import FormInputNumberfield from "@/component/FormInputNumberfield";
import { Checkbox } from "primereact/checkbox";
import { HeaderTable } from "@/component/datatable/DtHeaderTable";
import { DtCheckboxColumn, DtCheckboxColumnFilter } from "@/component/datatable/DtBooleanCheckbox";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const MappingUom = ({ kodeBarang }: { kodeBarang?: string | null }) => {
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
  const [selectedAction, setSelectedAction] = useState<String | null>(null);
  const [selectedUomBuy, setSelectedUomBuy] = useState<ItemUom | null>(null);
  const [selectedUomSell, setSelectedUomSell] = useState<ItemUom | null>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] = useState<FormItemUom>();
  const [uomList, setUomList] = useState<Uom[]>();

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
      command: () => confirmDeleteUom(),
    },
    // {
    //   label: selectedDataRow?.active_item ? "Deactive" : "Active",
    //   icon: selectedDataRow?.active_item ? "pi pi-times" : "pi pi-check",
    //   command: () => confirmActivate(),
    // },
    //   ],
    // },
  ];

  const fetcherUOMBuy = () =>
    axiosClient
      .get(`/api/mapping/item-uom/beli/${kodeBarang}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const {
    data: dataUOMBuy,
    error: errorUomBuy,
    isLoading: isLoadingUOMBuy,
    mutate: mutateUOMBuy,
  } = useSWR(
    kodeBarang ? `/api/mapping/item-uom/beli/${kodeBarang}` : null,
    fetcherUOMBuy
  );

  const fetcherUOMSell = () =>
    axiosClient
      .get(`/api/mapping/item-uom/jual/${kodeBarang}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const {
    data: dataUOMSell,
    error: errorUomSell,
    isLoading: isLoadingUomSell,
    mutate: mutateUomSell,
  } = useSWR(
    kodeBarang ? `/api/mapping/item-uom/jual/${kodeBarang}` : null,
    fetcherUOMSell
  );

  const updateItem = () => {
    parentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    if (selectedAction === "BELI") {
      setSelectedFormUpdate({
        kode_uom: selectedUomBuy?.kode_uom,
        kode_barang: kodeBarang!,
        nilai_konversi: selectedUomBuy?.jumlah_konversi,
        is_primary: selectedUomBuy?.priority,
        type: "BELI",
      });
    } else {
      setSelectedFormUpdate({
        kode_uom: selectedUomSell?.kode_uom,
        kode_barang: kodeBarang!,
        nilai_konversi: selectedUomSell?.jumlah_konversi,
        is_primary: selectedUomSell?.priority,
        type: "JUAL",
      });
    }

    setFormState("update");
  };

  const confirmDeleteUom = () => {
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
      const formData: FormItemUom =
        selectedAction === "BELI"
          ? {
              kode_barang: kodeBarang!,
              kode_uom: selectedUomBuy?.kode_uom,
            }
          : {
              kode_barang: kodeBarang!,
              kode_uom: selectedUomSell?.kode_uom,
            };

      const result =
        selectedAction === "BELI"
          ? await deleteUomBeli(formData)
          : await deleteUomJual(formData);
      setLayoutLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        selectedAction === "BELI" ? mutateUOMBuy() : mutateUomSell();
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
      const responseUom = await axiosClient.get("/api/master/unit-of-measure");
      const dataUom = responseUom.data;
      setUomList(dataUom);
    };
    getData();
  }, []);

  return (
    <div ref={parentRef}>
      <ContextMenu
        model={menuModel}
        ref={contextMenuRef}
        onHide={() => {
          setSelectedAction(null);
          setSelectedUomBuy(null);
          setSelectedUomSell(null);
        }}
      />
      {formState === "create" && (
        <ContainerCreate
          kodeBarang={kodeBarang}
          uomList={uomList}
          setFormState={setFormState}
          refreshUomBeli={mutateUOMBuy}
          refreshUomJual={mutateUomSell}
        />
      )}
      {formState === "update" && (
        <ContainerUpdate
          dataForm={selectedFormUpdate!}
          setFormState={setFormState}
          uomList={uomList}
          refreshUomBeli={mutateUOMBuy}
          refreshUomJual={mutateUomSell}
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
        header={HeaderTable({ headerTitle: "UOM Beli" })}
        className="mt-4"
        onContextMenu={(e: any) =>
          contextMenuRef.current?.show(e.originalEvent)
        }
        contextMenuSelection={selectedUomBuy}
        onContextMenuSelectionChange={(e: any) => {
          setSelectedUomBuy(e.value);
          setSelectedAction("BELI");
        }}
        loading={isLoadingUOMBuy}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={dataUOMBuy}
        filter="true"
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="id"
        sortField="nama_uom"
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
          field="nama_uom"
          header="Nama Uom Beli"
          sortable
          filter
          filterPlaceholder="Search by uom beli"
        ></Column>
        <Column field="jumlah_konversi" header="Jumlah" sortable></Column>
        <Column
          field="nama_satuan"
          header="Satuan"
          sortable
          filter
          filterPlaceholder="Search by satuan"
        ></Column>
        <Column
          dataType="boolean"
          field="priority"
          header="Priority"
          body={(rowData: ItemUom) => DtCheckboxColumn(rowData.priority)}
          filter
          filterElement={DtCheckboxColumnFilter}
        ></Column>
      </FormDatatable>
      <FormDatatable
        header={HeaderTable({ headerTitle: "UOM Jual" })}
        className="mt-4"
        onContextMenu={(e: any) =>
          contextMenuRef.current?.show(e.originalEvent)
        }
        contextMenuSelection={selectedUomSell}
        onContextMenuSelectionChange={(e: any) => {
          setSelectedUomSell(e.value);
          setSelectedAction("JUAL");
        }}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={dataUOMSell}
        filter="true"
        loading={isLoadingUomSell}
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="id"
        sortField="nama_uom"
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
          field="nama_uom"
          header="Nama Uom Jual"
          sortable
          filter
          filterPlaceholder="Search by uom beli"
        ></Column>
        <Column field="jumlah_konversi" header="Jumlah" sortable></Column>
        <Column
          field="nama_satuan"
          header="Satuan"
          sortable
          filter
          filterPlaceholder="Search by satuan"
        ></Column>
        <Column
          dataType="boolean"
          field="priority"
          header="Priority"
          body={(rowData: ItemUom) => DtCheckboxColumn(rowData.priority)}
          filter
          filterElement={DtCheckboxColumnFilter}
        ></Column>
      </FormDatatable>
    </div>
  );
};

const ContainerCreate = function ({
  setFormState,
  refreshUomBeli,
  refreshUomJual,
  kodeBarang,
  uomList,
}: {
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshUomBeli: KeyedMutator<any>;
  refreshUomJual: KeyedMutator<any>;
  kodeBarang?: string | null;
  uomList?: Uom[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialForm: FormItemUom = {
    type: "",
    kode_barang: kodeBarang ?? "",
    kode_uom: "",
    nilai_konversi: 0,
    is_primary: false,
  };
  const [formData, setFormData] = useState<FormItemUom>(initialForm);
  const [errors, setErrors] = useState<FormErrorItemUom>({});

  useEffect(() => {
    setFormData({
      type: "",
      kode_barang: kodeBarang ?? "",
      kode_uom: "",
      nilai_konversi: 0,
      is_primary: false,
    });
  }, [kodeBarang]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result =
        formData.type === "BELI"
          ? await createUomBeli(formData)
          : await createUomJual(formData);
      setLayoutLoading(false);
      setLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        formData.type === "BELI" ? refreshUomBeli() : refreshUomJual();
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
          labelText="Kategori UOM"
          value={formData?.type}
          errorText={errors?.type}
          options={[
            { value: "JUAL", label: "Jual" },
            { value: "BELI", label: "Beli" },
          ]}
          optionLabel="label"
          optionValue="value"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              type: event.value,
            }));
          }}
        />
        <FormInputSelect
          filter={true}
          required={true}
          labelText="Unit of Measurement"
          value={formData?.kode_uom}
          errorText={errors?.kode_uom}
          options={uomList}
          optionLabel="nama_uom"
          optionValue="kode_uom"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_uom: event.value,
            }));
          }}
        />
        <div className="grid gap-4 grid-cols-3">
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Jumlah UOM "
              value={formData.nilai_konversi}
              errorText={errors.nilai_konversi}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  nilai_konversi: event.value,
                }));
              }}
            />
          </div>
          <div className="flex items-end">
            <Checkbox
              inputId="isPrimary"
              name="Primary"
              onChange={(event) => {
                setFormData((previous) => ({
                  ...previous,
                  is_primary: event.checked!,
                }));
              }}
              checked={formData.is_primary!}
            />
            <label htmlFor="isPrimary" className="ml-2">
              Primary
            </label>
          </div>
        </div>
      </form>
    </Panel>
  );
};

const ContainerUpdate = function ({
  dataForm,
  setFormState,
  refreshUomBeli,
  refreshUomJual,
  kodeBarang,
  uomList,
}: {
  dataForm: FormItemUom;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshUomBeli: KeyedMutator<any>;
  refreshUomJual: KeyedMutator<any>;
  kodeBarang?: string | null;
  uomList?: Uom[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormItemUom>({
    type: "JUAL",
    kode_uom: "",
    kode_barang: "",
    nilai_konversi: 0,
    is_primary: false,
  });
  const [errors, setErrors] = useState<FormErrorItemUom>({});

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
      const result =
        formData.type === "BELI"
          ? await updateUomBeli(formData)
          : await updateUomJual(formData);
      setLayoutLoading(false);
      setLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        formData.type === "BELI" ? refreshUomBeli() : refreshUomJual();
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
          labelText="Kategori UOM"
          value={formData?.type}
          errorText={errors?.type}
          options={[
            { value: "JUAL", label: "Jual" },
            { value: "BELI", label: "Beli" },
          ]}
          optionLabel="label"
          optionValue="value"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              type: event.value,
            }));
          }}
        />
        <FormInputSelect
          disabled={true}
          filter={true}
          required={true}
          labelText="Unit of Measurement"
          value={formData?.kode_uom}
          errorText={errors?.kode_uom}
          options={uomList}
          optionLabel="nama_uom"
          optionValue="kode_uom"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_uom: event.value,
            }));
          }}
        />
        <div className="grid gap-4 grid-cols-3">
          <div className="col-span-3 md:col-span-1">
            <FormInputNumberfield
              labelText="Jumlah UOM "
              value={formData.nilai_konversi}
              errorText={errors.nilai_konversi}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  nilai_konversi: event.value,
                }));
              }}
            />
          </div>
          <div className="flex items-end">
            <Checkbox
              inputId="isPrimary"
              name="Primary"
              onChange={(event) => {
                setFormData((previous) => ({
                  ...previous,
                  is_primary: event.checked!,
                }));
              }}
              checked={formData.is_primary!}
            />
            <label htmlFor="isPrimary" className="ml-2">
              Primary
            </label>
          </div>
        </div>
      </form>
    </Panel>
  );
};

export default MappingUom;
