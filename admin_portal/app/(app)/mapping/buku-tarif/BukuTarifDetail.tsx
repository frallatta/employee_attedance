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
import { encryptData } from "@/lib/encryption";
import { KandunganObat, KelasTarif, Uom } from "@/types/master";
import FormInputSelect from "@/component/FormInputSelect";
import FormInputNumberfield from "@/component/FormInputNumberfield";
import { Checkbox } from "primereact/checkbox";
import { HeaderTable } from "@/component/datatable/DtHeaderTable";
import {
  DtCheckboxColumn,
  DtCheckboxColumnFilter,
} from "@/component/datatable/DtBooleanCheckbox";
import { ItemBasePrice, ItemData } from "@/types/item";
import {
  BukuTarifDetail,
  FormBukuTarifDetail,
  FormErrorBukuTarifDetail,
} from "@/types/buku-tarif";
import { createBukuTarifDetail, updateBukuTarifDetail } from "./action";
import { formatCurrencyID } from "@/lib/currency";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const BukuTarifDetailTemplate = ({
  idBukuTarif,
  kodeCompany,
  isActive,
  itemDataList,
  kelasTarifList,
}: {
  idBukuTarif?: number | null;
  kodeCompany?: string | null;
  isActive: boolean;
  itemDataList: ItemData[];
  kelasTarifList: KelasTarif[];
}) => {
  const router = useRouter();
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    nama_barang: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_kelas: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedBukuTarifDetail, setSelectedBukuTarifDetail] =
    useState<BukuTarifDetail | null>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] =
    useState<FormBukuTarifDetail>();

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
    // {
    //   label: "Delete",
    //   icon: "pi pi-trash",
    //   command: () => confirmDelete(),
    // },
    // {
    //   label: selectedDataRow?.active_item ? "Deactive" : "Active",
    //   icon: selectedDataRow?.active_item ? "pi pi-times" : "pi pi-check",
    //   command: () => confirmActivate(),
    // },
    //   ],
    // },
  ];

  const fetcherBukuTarifDetail = () => {
    const params = {
      idBukuTarif: idBukuTarif,
    };

    return axiosClient
      .get(`/api/mapping/buku-tarif/detail/`, {
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
    mutate,
  } = useSWR(
    idBukuTarif && isActive
      ? `/api/mapping/buku-tarif/detail/${idBukuTarif}`
      : null,
    fetcherBukuTarifDetail
  );

  const updateItem = () => {
    parentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    setSelectedFormUpdate({
      id_buku_tarif: idBukuTarif!.toString(),
      kode_company: kodeCompany!,
      base_price: selectedBukuTarifDetail?.baseprice,
      kode_barang: selectedBukuTarifDetail?.kode_barang,
      kode_kelas: selectedBukuTarifDetail?.kode_kelas,
      sales_price: selectedBukuTarifDetail?.salesprice,
    });

    setFormState("update");
  };

  useEffect(() => {
    mutate();
  }, [kodeCompany, isActive, mutate]);

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
  //     const formData: FormBukuTarifDetail = {
  //       kode_barang: kodeBarang!,
  //       kode_kandungan: selectedBukuTarifDetail?.kode_kandungan,
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
      {isActive && (
        <>
          <ContextMenu
            model={menuModel}
            ref={contextMenuRef}
            onHide={() => {
              setSelectedBukuTarifDetail(null);
            }}
          />
          {formState === "create" && (
            <ContainerCreate
              idBukuTarif={idBukuTarif?.toString()}
              kodeCompany={kodeCompany}
              setFormState={setFormState}
              refreshData={mutate}
              itemDataList={itemDataList}
              kelasTarifList={kelasTarifList}
            />
          )}
          {formState === "update" && (
            <ContainerUpdate
              dataForm={selectedFormUpdate!}
              setFormState={setFormState}
              refreshData={mutate}
              itemDataList={itemDataList}
              kelasTarifList={kelasTarifList}
              idBukuTarif={idBukuTarif?.toString()}
              kodeCompany={kodeCompany}
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
        </>
      )}

      <FormDatatable
        //header={HeaderTable({ headerTitle: "Item Kandungan" })}
        className="mt-4"
        onContextMenu={(e: any) =>
          contextMenuRef.current?.show(e.originalEvent)
        }
        contextMenuSelection={selectedBukuTarifDetail}
        onContextMenuSelectionChange={(e: any) => {
          setSelectedBukuTarifDetail(e.value);
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
        dataKey="id_detail"
        sortField="nama_barang"
        sortOrder={1}
      >
        <Column
          field="nama_barang"
          header="Nama Barang"
          sortable
          filter
          filterPlaceholder="Search by nama barang"
        ></Column>
        <Column
          field="nama_kelas"
          header="Kelas Tarif"
          sortable
          filter
          filterPlaceholder="Search by kelas tarif"
        ></Column>
        <Column
          dataType="numeric"
          field="baseprice"
          header="Base Price"
          body={(data: BukuTarifDetail) => formatCurrencyID(data.baseprice)}
          sortable
        ></Column>
        <Column
          dataType="numeric"
          field="salesprice"
          header="Sales Price"
          body={(data: BukuTarifDetail) => formatCurrencyID(data.salesprice)}
          sortable
        ></Column>
      </FormDatatable>
    </div>
  );
};

const ContainerCreate = function ({
  setFormState,
  refreshData,
  kodeCompany,
  idBukuTarif,
  itemDataList,
  kelasTarifList,
}: {
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  kodeCompany?: string | null;
  idBukuTarif?: string | null;
  itemDataList?: ItemData[];
  kelasTarifList?: KelasTarif[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialForm: FormBukuTarifDetail = {
    kode_company: kodeCompany ?? "",
    id_buku_tarif: idBukuTarif ?? "",
    base_price: 0,
    sales_price: 0,
    kode_barang: "",
    kode_kelas: "",
  };
  const [formData, setFormData] = useState<FormBukuTarifDetail>(initialForm);
  const [errors, setErrors] = useState<FormErrorBukuTarifDetail>({});

  useEffect(() => {
    setFormData({
      kode_company: kodeCompany ?? "",
      id_buku_tarif: idBukuTarif ?? "",
      base_price: 0,
      sales_price: 0,
      kode_barang: "",
      kode_kelas: "",
    });
  }, [kodeCompany, idBukuTarif]);

  useEffect(() => {
    const getBasePrice = async () => {
      setLoading(true);
      const resBasePrice = await axiosClient.get(
        `/api/master/base-price/kode/${formData.kode_barang}`
      );
      const dataBasePrice: ItemBasePrice = resBasePrice.data;
      setFormData((previous) => ({
        ...previous,
        base_price: dataBasePrice.baseprice,
      }));
      setLoading(false);
    };

    if (formData.kode_barang) {
      getBasePrice();
    }
  }, [formData.kode_barang]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result = await createBukuTarifDetail(formData);
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
        const validateError: FormErrorBukuTarifDetail = result.errorData;
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
        kode_company: kodeCompany ?? "",
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
            form="form-create-detail"
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
        id="form-create-detail"
      >
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Item"
          value={formData?.kode_barang}
          errorText={errors?.kode_barang}
          options={itemDataList}
          optionLabel="nama_barang"
          optionValue="kode_barang"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_barang: event.value,
            }));
          }}
        />
        <FormInputSelect
          required={true}
          filter="true"
          labelText="Kelas Tarif"
          value={formData?.kode_kelas}
          errorText={errors?.kode_kelas}
          options={kelasTarifList}
          optionLabel="nama_kelas"
          optionValue="kode_kelas"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_kelas: event.value,
            }));
          }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FormInputNumberfield
              labelText="Sales Price"
              isCurrency={true}
              value={formData.sales_price}
              errorText={errors.sales_price}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  sales_price: event.value,
                }));
              }}
            />
          </div>
          <div>
            <FormInputNumberfield
              labelText="Base Price"
              isCurrency={true}
              disabled={true}
              value={formData.base_price}
              errorText={errors.base_price}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  base_price: event.value,
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
  idBukuTarif,
  kodeCompany,
  itemDataList,
  kelasTarifList,
}: {
  dataForm: FormBukuTarifDetail;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  idBukuTarif?: string | null;
  kodeCompany?: string | null;
  itemDataList?: ItemData[];
  kelasTarifList?: KelasTarif[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormBukuTarifDetail>({
    kode_company: kodeCompany ?? "",
    id_buku_tarif: idBukuTarif ?? "",
    base_price: 0,
    sales_price: 0,
    kode_barang: "",
    kode_kelas: "",
  });
  const [errors, setErrors] = useState<FormErrorBukuTarifDetail>({});

  useEffect(() => {
    if (dataForm) {
      setFormData(dataForm);
    }
  }, [dataForm, kodeCompany, idBukuTarif]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result = await updateBukuTarifDetail(formData);
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
        const validateError: FormErrorBukuTarifDetail = result.errorData;
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
            form="form-update-detail"
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
        id="form-update-detail"
      >
        <FormInputSelect
          disabled={true}
          required={true}
          filter="true"
          labelText="Item"
          value={formData?.kode_barang}
          errorText={errors?.kode_barang}
          options={itemDataList}
          optionLabel="nama_barang"
          optionValue="kode_barang"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_barang: event.value,
            }));
          }}
        />
        <FormInputSelect
          disabled={true}
          required={true}
          filter="true"
          labelText="Kelas Tarif"
          value={formData?.kode_kelas}
          errorText={errors?.kode_kelas}
          options={kelasTarifList}
          optionLabel="nama_kelas"
          optionValue="kode_kelas"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_kelas: event.value,
            }));
          }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FormInputNumberfield
              labelText="Sales Price"
              isCurrency={true}
              value={formData.sales_price}
              errorText={errors.sales_price}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  sales_price: event.value,
                }));
              }}
            />
          </div>
          <div>
            <FormInputNumberfield
              labelText="Base Price"
              isCurrency={true}
              disabled={true}
              value={formData.base_price}
              errorText={errors.base_price}
              onChange={(event: any) => {
                setFormData((previous) => ({
                  ...previous,
                  base_price: event.value,
                }));
              }}
            />
          </div>
        </div>
      </form>
    </Panel>
  );
};

export default BukuTarifDetailTemplate;
