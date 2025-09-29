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
  FormErrorItemDistributor,
  FormErrorItemUom,
  FormItemDistributor,
  FormItemUom,
  ItemData,
  ItemDistributor,
  ItemUom,
} from "@/types/item";
import { encryptData } from "@/lib/encryption";
import { createDistributor, updateDistributor } from "./action";
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
import MappingPrincipal from "./MappingPrincipal";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const MappingDistributor = ({
  kodeBarang,
  distributorList,
  principalList,
  uomList,
}: {
  kodeBarang?: string | null;
  distributorList: Distributor[];
  principalList: Principal[];
  uomList: ItemUom[];
}) => {
  const router = useRouter();
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    kode_distributor: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_distributor: { value: "", matchMode: FilterMatchMode.CONTAINS },
    satuan_uom: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nilai_konversi: { value: "", matchMode: FilterMatchMode.CONTAINS },
    discount: { value: "", matchMode: FilterMatchMode.CONTAINS },
    pricelist: { value: "", matchMode: FilterMatchMode.CONTAINS },
    level_purchasing: { value: "", matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: "", matchMode: FilterMatchMode.EQUALS },
  });
  const [selectedRowDistributor, setSelectedRowDistributor] =
    useState<ItemDistributor | null>(null);
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedItemDistributor, setSelectedItemDistributor] =
    useState<ItemDistributor | null>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] =
    useState<FormItemDistributor>();
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

  const fetcherDistributor = () =>
    axiosClient
      .get(`/api/mapping/item-pabrik/distributor/item/${kodeBarang}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const {
    data: dataDistributor,
    error: error,
    isLoading,
    mutate,
  } = useSWR(
    kodeBarang
      ? `/api/mapping/item-pabrik/distributor/item/${kodeBarang}`
      : null,
    fetcherDistributor
  );

  const updateItem = () => {
    parentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    setSelectedFormUpdate({
      kode_distributor: selectedItemDistributor?.kode_distributor,
      kode_barang: kodeBarang!,
      disc_distributor: selectedItemDistributor?.discount,
      hna_distributor: selectedItemDistributor?.pricelist,
      is_active_distributor: selectedItemDistributor?.is_active,
      kode_uom: selectedItemDistributor?.uom_beli,
      level_purchasing_distributor: selectedItemDistributor?.level_purchasing,
    });

    setFormState("update");
  };

  useEffect(() => {
    setSelectedRowDistributor(null);
  }, [kodeBarang]);

  // const confirmDelete = () => {
  //   confirmDialog({
  //     message: "Are you sure you want to proceed?",
  //     header: "Confirmation",
  //     icon: "pi pi-exclamation-triangle",
  //     defaultFocus: "accept",
  //     accept: deleteItem,
  //   });
  // };

  // const deleteItem = async () => {
  //   setLayoutLoading(true);
  //   try {
  //     const formData: FormItemDistributor = {
  //       kode_barang: kodeBarang!,
  //       kode_kandungan: selectedItemDistributor?.kode_kandungan,
  //     };

  //     const result = await deleteData(formData);
  //     setLayoutLoading(false);
  //     if (result.success) {
  //       toastRef.current.show({
  //         severity: "success",
  //         summary: "Success",
  //         detail: result.message,
  //       });
  //       mutate();
  //     } else {
  //       const validateError: FormErrorItemUom = result.errorData;
  //       if (validateError.message) {
  //         toastRef.current.show({
  //           severity: "error",
  //           summary: "Failed",
  //           detail: result.errorMessage,
  //         });
  //       }
  //       return;
  //     }
  //   } catch (e: any) {
  //     setLayoutLoading(false);
  //     toastRef.current.show({
  //       severity: "error",
  //       summary: "Failed",
  //       detail: e.message,
  //     });
  //   }
  // };

  return (
    <div ref={parentRef}>
      <ContextMenu
        model={menuModel}
        ref={contextMenuRef}
        onHide={() => {
          setSelectedItemDistributor(null);
        }}
      />
      {formState === "create" && (
        <ContainerCreate
          kodeBarang={kodeBarang}
          uomList={uomList}
          setFormState={setFormState}
          refreshData={mutate}
          distributorList={distributorList}
        />
      )}
      {formState === "update" && (
        <ContainerUpdate
          dataForm={selectedFormUpdate!}
          setFormState={setFormState}
          uomList={uomList}
          refreshData={mutate}
          distributorList={distributorList}
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
        contextMenuSelection={selectedItemDistributor}
        onContextMenuSelectionChange={(e: any) => {
          setSelectedItemDistributor(e.value);
        }}
        selectionMode="single"
        selection={selectedRowDistributor}
        onSelectionChange={(e: any) => setSelectedRowDistributor(e.value)}
        loading={isLoading}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={dataDistributor}
        filter="true"
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="id_distributor"
        sortField="kode_distributor"
        sortOrder={1}
      >
        <Column
          field="kode_distributor"
          header="Kode"
          sortable
          filter
          filterPlaceholder="Search by code"
        ></Column>
        <Column
          field="nama_distributor"
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
          body={(data: ItemDistributor) => DtCheckboxColumn(data.is_active)}
          filter
          filterElement={DtCheckboxColumnFilter}
          sortable
        ></Column>
      </FormDatatable>

      {selectedRowDistributor && (
        <>
          <FormButton
            labelText="Close Principal"
            severity="secondary"
            onClick={() => {
              setSelectedRowDistributor(null);
            }}
          />
          <Divider />
          <>
            <div className="flex justify-between mb-2">
              <p className="text-lg font-medium">
                Distributor Pabrik Barang -{" "}
                {selectedRowDistributor.nama_distributor}
              </p>
              {/* <FormButton labelText="Close" /> */}
            </div>
          </>
          <>
            <MappingPrincipal
              kodeBarang={selectedRowDistributor.kode_barang}
              kodeDistributor={selectedRowDistributor.kode_distributor}
              principalList={principalList!}
              uomList={uomList!}
            />
          </>
        </>
      )}
    </div>
  );
};

const ContainerCreate = function ({
  setFormState,
  refreshData,
  kodeBarang,
  uomList,
  distributorList,
}: {
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  kodeBarang?: string | null;
  uomList?: ItemUom[];
  distributorList?: Distributor[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialForm: FormItemDistributor = {
    kode_barang: kodeBarang ?? "",
    kode_distributor: "",
    disc_distributor: 0,
    hna_distributor: 0,
    is_active_distributor: false,
    kode_uom: "",
    level_purchasing_distributor: 1,
  };
  const [formData, setFormData] = useState<FormItemDistributor>(initialForm);
  const [errors, setErrors] = useState<FormErrorItemDistributor>({});

  useEffect(() => {
    setFormData({
      kode_barang: kodeBarang ?? "",
      kode_distributor: "",
      disc_distributor: 0,
      hna_distributor: 0,
      is_active_distributor: false,
      kode_uom: "",
      level_purchasing_distributor: 1,
    });
  }, [kodeBarang]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result = await createDistributor(formData);
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
        const validateError: FormErrorItemDistributor = result.errorData;
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
            form="form-create-distributor"
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
        id="form-create-distributor"
      >
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Distributor"
          value={formData?.kode_distributor}
          errorText={errors?.kode_distributor}
          options={distributorList}
          optionLabel="nama_distributor"
          optionValue="kode_distributor"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_distributor: event.value,
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
              value={formData.hna_distributor}
              errorText={errors.hna_distributor}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  hna_distributor: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Persentase Diskon"
              value={formData.disc_distributor}
              errorText={errors.disc_distributor}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  disc_distributor: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Level Distributor"
              value={formData.level_purchasing_distributor}
              errorText={errors.level_purchasing_distributor}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  level_purchasing_distributor: event.value,
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
  distributorList,
}: {
  dataForm: FormItemDistributor;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  kodeBarang?: string | null;
  uomList?: ItemUom[];
  distributorList?: Distributor[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormItemDistributor>({
    kode_barang: kodeBarang ?? "",
    kode_distributor: "",
    disc_distributor: 0,
    hna_distributor: 0,
    is_active_distributor: false,
    kode_uom: "",
    level_purchasing_distributor: 1,
  });
  const [errors, setErrors] = useState<FormErrorItemDistributor>({});

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
      const result = await updateDistributor(formData);
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
        const validateError: FormErrorItemDistributor = result.errorData;
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
            form="form-update-distributor"
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
        id="form-update-distributor"
      >
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Distributor"
          value={formData?.kode_distributor}
          errorText={errors?.kode_distributor}
          options={distributorList}
          optionLabel="nama_distributor"
          optionValue="kode_distributor"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_distributor: event.value,
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
              value={formData.hna_distributor}
              errorText={errors.hna_distributor}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  hna_distributor: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Persentase Diskon"
              value={formData.disc_distributor}
              errorText={errors.disc_distributor}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  disc_distributor: event.value,
                }));
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumberfield
              labelText="Level Distributor"
              value={formData.level_purchasing_distributor}
              errorText={errors.level_purchasing_distributor}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  level_purchasing_distributor: event.value,
                }));
              }}
            />
          </div>
        </div>
        <FormInputSwitch
          checkedValue={formData.is_active_distributor!}
          errorText={errors.is_active_distributor}
          labelText="Is Active"
          required={true}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              is_active_distributor: event.value,
            }));
          }}
        />
      </form>
    </Panel>
  );
};

export default MappingDistributor;
