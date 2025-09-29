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
  FormErrorItemPrincipal,
  FormErrorItemUom,
  FormItemPrincipal,
  FormItemUom,
  ItemData,
  ItemPrincipal,
  ItemUom,
} from "@/types/item";
import { encryptData } from "@/lib/encryption";
import {
  createDistributor,
  createPrincipal,
  updateDistributor,
  updatePrincipal,
} from "./action";
import { Distributor, KandunganObat, Principal, Uom } from "@/types/master";
import FormInputSelect from "@/component/FormInputSelect";
import FormInputNumberfield from "@/component/FormInputNumberfield";
import { Checkbox } from "primereact/checkbox";
import { HeaderTable } from "@/component/datatable/DtHeaderTable";
import {
  DtCheckboxColumn,
  DtCheckboxColumnFilter,
} from "@/component/datatable/DtBooleanCheckbox";
import FormInputSwitch from "@/component/FormInputSwitch";
import { Divider } from "primereact/divider";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const MappingPrincipal = ({
  kodeBarang,
  kodeDistributor,
  principalList,
  uomList,
}: {
  kodeBarang?: string | null;
  kodeDistributor?: string | null;
  principalList: Principal[];
  uomList: ItemUom[];
}) => {
  const router = useRouter();
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    kode_principal: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_principal: { value: "", matchMode: FilterMatchMode.CONTAINS },
    satuan_uom: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nilai_konversi: { value: "", matchMode: FilterMatchMode.CONTAINS },
    discount: { value: "", matchMode: FilterMatchMode.CONTAINS },
    pricelist: { value: "", matchMode: FilterMatchMode.CONTAINS },
    level_purchasing: { value: "", matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: "", matchMode: FilterMatchMode.EQUALS },
  });
  //   const [selectedRowDistributor, setSelectedRowDistributor] =
  //     useState<ItemPrincipal | null>(null);
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedItemPrincipal, setSelectedItemPrincipal] =
    useState<ItemPrincipal | null>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] =
    useState<FormItemPrincipal>();
  const parentRef = useRef<HTMLDivElement>(null);

  const contextMenuRef = useRef<ContextMenu>(null);
  const menuModel: MenuItem[] = [
    {
      label: "Update",
      icon: "pi pi-pen-to-square",
      command: () => updateItem(),
    },
    // {
    //   label: "Delete",
    //   icon: "pi pi-trash",
    //   command: () => confirmDelete(),
    // },
  ];

  const fetcherPrincipal = () =>
    axiosClient
      .get(
        `/api/mapping/item-pabrik/principal/item/${kodeBarang}/distributor/${kodeDistributor}`
      )
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const {
    data: dataPrincipal,
    error: error,
    isLoading,
    mutate,
  } = useSWR(
    kodeBarang && kodeDistributor
      ? `/api/mapping/item-pabrik/principal/item/${kodeBarang}/distributor/${kodeDistributor}`
      : null,
    fetcherPrincipal
  );

  const updateItem = () => {
    parentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    setSelectedFormUpdate({
      kode_distributor: selectedItemPrincipal?.kode_distributor,
      kode_barang: selectedItemPrincipal?.kode_barang,
      kode_principal: selectedItemPrincipal?.kode_principal,
      disc_principal: selectedItemPrincipal?.discount,
      hna_principal: selectedItemPrincipal?.pricelist,
      is_active_principal: selectedItemPrincipal?.is_active,
      kode_uom: selectedItemPrincipal?.uom_beli,
      level_purchasing_principal: selectedItemPrincipal?.level_purchasing,
    });

    setFormState("update");
  };

  return (
    <div ref={parentRef}>
      <ContextMenu
        model={menuModel}
        ref={contextMenuRef}
        onHide={() => {
          setSelectedItemPrincipal(null);
        }}
      />
      {formState === "create" && (
        <ContainerCreate
          kodeBarang={kodeBarang}
          kodeDistributor={kodeDistributor}
          uomList={uomList}
          setFormState={setFormState}
          refreshData={mutate}
          principalList={principalList}
        />
      )}
      {formState === "update" && (
        <ContainerUpdate
          dataForm={selectedFormUpdate!}
          setFormState={setFormState}
          uomList={uomList}
          refreshData={mutate}
          principalList={principalList}
          kodeBarang={kodeBarang}
          kodeDistributor={kodeDistributor}
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
        contextMenuSelection={selectedItemPrincipal}
        onContextMenuSelectionChange={(e: any) => {
          setSelectedItemPrincipal(e.value);
        }}
        loading={isLoading}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={dataPrincipal}
        filter="true"
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="id_principal"
        sortField="kode_principal"
        sortOrder={1}
      >
        <Column
          field="kode_principal"
          header="Kode"
          sortable
          filter
          filterPlaceholder="Search by code"
        ></Column>
        <Column
          field="nama_principal"
          header="Nama"
          sortable
          filter
          filterPlaceholder="Search by nama"
        ></Column>
        <Column field="satuan_uom" header="UOM" sortable></Column>
        <Column field="nilai_konversi" header="Konversi" sortable></Column>
        <Column field="discount" header="Discount" sortable></Column>
        <Column field="pricelist" header="Pricelist" sortable></Column>
        <Column
          field="level_purchasing"
          header="Level Purchasing"
          sortable
        ></Column>
        <Column
          dataType="boolean"
          field="is_active"
          header="Is Active"
          body={(data: ItemPrincipal) => DtCheckboxColumn(data.is_active)}
          filter
          filterElement={DtCheckboxColumnFilter}
          sortable
        ></Column>
      </FormDatatable>
    </div>
  );
};

const ContainerCreate = function ({
  setFormState,
  refreshData,
  kodeBarang,
  kodeDistributor,
  uomList,
  principalList,
}: {
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  kodeBarang?: string | null;
  kodeDistributor?: string | null;
  uomList?: ItemUom[];
  principalList?: Principal[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialForm: FormItemPrincipal = {
    kode_barang: kodeBarang ?? "",
    kode_distributor: kodeDistributor ?? "",
    kode_principal: "",
    disc_principal: 0,
    hna_principal: 0,
    is_active_principal: false,
    kode_uom: "",
    level_purchasing_principal: 1,
  };
  const [formData, setFormData] = useState<FormItemPrincipal>(initialForm);
  const [errors, setErrors] = useState<FormErrorItemPrincipal>({});

  useEffect(() => {
    setFormData({
      kode_barang: kodeBarang ?? "",
      kode_distributor: kodeDistributor ?? "",
      kode_principal: "",
      disc_principal: 0,
      hna_principal: 0,
      is_active_principal: false,
      kode_uom: "",
      level_purchasing_principal: 1,
    });
  }, [kodeBarang, kodeDistributor]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result = await createPrincipal(formData);
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
        const validateError: FormErrorItemPrincipal = result.errorData;
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
        kode_distributor: kodeDistributor ?? "",
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
            form="form-create-principal"
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
        id="form-create-principal"
      >
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Principal"
          value={formData?.kode_principal}
          errorText={errors?.kode_principal}
          options={principalList}
          optionLabel="nama_principal"
          optionValue="kode_principal"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_principal: event.value,
            }));
          }}
        />
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Unit of Measure"
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="HNA"
              value={formData.hna_principal}
              errorText={errors.hna_principal}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  hna_principal: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Persentase Diskon"
              value={formData.disc_principal}
              errorText={errors.disc_principal}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  disc_principal: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Level Principal"
              value={formData.level_purchasing_principal}
              errorText={errors.level_purchasing_principal}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  level_purchasing_principal: event.value,
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
  kodeDistributor,
  uomList,
  principalList,
}: {
  dataForm: FormItemPrincipal;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  kodeBarang?: string | null;
  kodeDistributor?: string | null;
  uomList?: ItemUom[];
  principalList?: Principal[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormItemPrincipal>({
    kode_barang: kodeBarang ?? "",
    kode_distributor: kodeDistributor ?? "",
    kode_principal: "",
    disc_principal: 0,
    hna_principal: 0,
    is_active_principal: false,
    kode_uom: "",
    level_purchasing_principal: 1,
  });
  const [errors, setErrors] = useState<FormErrorItemPrincipal>({});

  useEffect(() => {
    if (dataForm) {
      setFormData(dataForm);
    }
  }, [dataForm, kodeBarang, kodeDistributor]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result = await updatePrincipal(formData);
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
        const validateError: FormErrorItemPrincipal = result.errorData;
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
            form="form-update-principal"
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
        id="form-update-principal"
      >
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Principal"
          value={formData?.kode_principal}
          errorText={errors?.kode_principal}
          options={principalList}
          optionLabel="nama_principal"
          optionValue="kode_principal"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_principal: event.value,
            }));
          }}
        />
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Unit of Measure"
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="HNA"
              value={formData.hna_principal}
              errorText={errors.hna_principal}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  hna_principal: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Persentase Diskon"
              value={formData.disc_principal}
              errorText={errors.disc_principal}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  disc_principal: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Level Distributor"
              value={formData.level_purchasing_principal}
              errorText={errors.level_purchasing_principal}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  level_purchasing_principal: event.value,
                }));
              }}
            />
          </div>
        </div>
        <FormInputSwitch
          checkedValue={formData.is_active_principal!}
          errorText={errors.is_active_principal}
          labelText="Is Active"
          required={true}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              is_active_principal: event.value,
            }));
          }}
        />
      </form>
    </Panel>
  );
};

export default MappingPrincipal;
