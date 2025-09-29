"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import useSWR, { KeyedMutator } from "swr";
import FormDatatable from "@/component/FormDatatable";
import { Column } from "primereact/column";
import axiosClient from "@/lib/axiosClient";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { FilterMatchMode } from "primereact/api";
import { DataTableFilterMeta, DataTableStateEvent } from "primereact/datatable";
import { ContextMenu } from "primereact/contextmenu";
import { useRouter } from "next/navigation";
import { Divider } from "primereact/divider";
import {
  BukuTarif,
  FormBukuTarif,
  FormErrorBukuTarif,
} from "@/types/buku-tarif";
import {
  DtCheckboxColumn,
  DtCheckboxColumnFilter,
} from "@/component/datatable/DtBooleanCheckbox";
import {
  DtBooleanColumn,
  DtBooleanColumnFilter,
} from "@/component/datatable/DtBooleanColumn";
import FormButton from "@/component/FormButton";
import { Panel } from "primereact/panel";
import FormInputText from "@/component/FormInputText";
import { Company, KelasTarif } from "@/types/master";
import FormInputSelect from "@/component/FormInputSelect";
import FormInputDatepicker from "@/component/FormInputDatepicker";
import { format, parseISO } from "date-fns";
import FormInputSwitch from "@/component/FormInputSwitch";
import { createBukuTarif, updateBukuTarif } from "./action";
import { MenuItem } from "primereact/menuitem";
import BukuTarifDetailTemplate from "./BukuTarifDetail";
import { ItemData } from "@/types/item";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const BukuTarifTemplate = ({
  companyList,
  itemDataList,
  kelasTarifList,
}: {
  companyList: Company[];
  itemDataList: ItemData[];
  kelasTarifList: KelasTarif[];
}) => {
  const router = useRouter();
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    nama_company: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_buku_tarif: { value: "", matchMode: FilterMatchMode.CONTAINS },
    active: { value: null, matchMode: FilterMatchMode.EQUALS },
    memakai_tarif_rs: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedRowBukuTarif, setSelectedRowBukuTarif] =
    useState<BukuTarif | null>();
  const [selectedDataRow, setSelectedDataRow] = useState<BukuTarif | null>(
    null
  );
  const parentRef = useRef<HTMLDivElement>(null);
  const bukuTarifDetailRef = useRef<HTMLDivElement>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] = useState<BukuTarif>();
  const contextMenuRef = useRef<ContextMenu>(null);

  const menuModel: MenuItem[] = [
    // {
    //   label: "Action",
    //   items: [
    {
      label: "Update",
      icon: "pi pi-pen-to-square",
      command: () => confirmUpdate(),
    },
    //   ],
    // },
  ];

  const fetcherDataBukuTarif = () =>
    axiosClient
      .get("/api/mapping/buku-tarif", {
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
    "/api/mapping/buku-tarif",
    fetcherDataBukuTarif
  );

  const confirmUpdate = () => {
    parentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    setSelectedRowBukuTarif(null);
    setSelectedFormUpdate(selectedDataRow!);
    setFormState("update");
  };

  useEffect(() => {
    if (!selectedRowBukuTarif?.memakai_tarif_rs) {
      bukuTarifDetailRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [selectedRowBukuTarif]);

  return (
    <div ref={parentRef}>
      <ContextMenu
        model={menuModel}
        ref={contextMenuRef}
        onHide={() => setSelectedDataRow(null)}
      />
      {formState === "create" && (
        <ContainerCreate
          companyList={companyList}
          setFormState={setFormState}
          refreshData={mutate}
        />
      )}
      {formState === "update" && (
        <ContainerUpdate
          dataForm={selectedFormUpdate!}
          setFormState={setFormState}
          companyList={companyList}
          refreshData={mutate}
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
        className="mt-4"
        {...(!formState
          ? {
              selectionMode: "single",
              selection: selectedRowBukuTarif,
              onSelectionChange: (e: any) => setSelectedRowBukuTarif(e.value),
            }
          : {})}
        // selection={selectedRowBukuTarif}
        // onSelectionChange={(e: any) => setSelectedRowBukuTarif(e.value)}
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
        dataKey="id_buku_tarif"
        sortField="nama_company"
        sortOrder={1}
      >
        <Column
          field="nama_company"
          header="Nama Company"
          sortable
          filter
          filterPlaceholder="Search by name"
        ></Column>
        <Column
          field="nama_buku_tarif"
          header="Buku Tarif"
          sortable
          filter
          filterPlaceholder="Search by buku tarif"
        ></Column>
        <Column
          dataType="date"
          field="start_date"
          header="Start Date"
          sortable
        ></Column>
        <Column
          dataType="date"
          field="end_date"
          header="End Date"
          sortable
        ></Column>
        <Column
          dataType="boolean"
          field="memakai_tarif_rs"
          header="Pakai Tarif RS"
          body={(rowData: BukuTarif) =>
            DtCheckboxColumn(rowData.memakai_tarif_rs)
          }
          filter
          filterElement={DtCheckboxColumnFilter}
        ></Column>
        <Column
          dataType="boolean"
          field="active"
          header="Active"
          body={(rowData: BukuTarif) => DtBooleanColumn(rowData.active)}
          filter
          filterElement={DtBooleanColumnFilter}
        ></Column>
      </FormDatatable>
      {selectedRowBukuTarif &&
        !formState &&
        !selectedRowBukuTarif.memakai_tarif_rs && (
          <>
            <div
              className="border border-gray-200 rounded  mt-2 p-4"
              ref={bukuTarifDetailRef}
            >
              <div>
                <p className="text-xl font-medium !my-0">
                  {selectedRowBukuTarif?.nama_company} -{" "}
                  {selectedRowBukuTarif?.nama_buku_tarif}
                </p>
                {/* <p>{selectedMappingItem?.nama_bentuk}</p> */}
              </div>
              <Divider />
              <>
                <div className="flex justify-between mb-2">
                  <p className="text-lg font-medium">Buku Tarif Detail</p>
                  {/* <FormButton labelText="Close" /> */}
                </div>
              </>
              <>
                <BukuTarifDetailTemplate
                  idBukuTarif={selectedRowBukuTarif.id_buku_tarif}
                  kodeCompany={selectedRowBukuTarif.kode_company}
                  itemDataList={itemDataList}
                  kelasTarifList={kelasTarifList}
                  isActive={selectedRowBukuTarif.active}
                />
              </>
            </div>
          </>
        )}
    </div>
  );
};

const ContainerCreate = function ({
  setFormState,
  refreshData,
  companyList,
}: {
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  companyList: Company[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialForm: FormBukuTarif = {
    id_buku_tarif: undefined,
    kode_company: "",
    nama_tarif: "",
    start_date: "",
    end_date: "",
    is_active: false,
    tarif_rs: false,
  };
  const [formData, setFormData] = useState<FormBukuTarif>(initialForm);
  const [errors, setErrors] = useState<FormErrorBukuTarif>({});

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      const result = await createBukuTarif(formData);
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
        const validateError: FormErrorBukuTarif = result.errorData;
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

      setFormData(initialForm);
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
          labelText="Company"
          value={formData?.kode_company}
          errorText={errors?.kode_company}
          options={companyList}
          optionLabel="nama_company"
          optionValue="kode_company"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_company: event.value,
            }));
          }}
        />
        <FormInputText
          labelText="Nama Buku Tarif"
          value={formData.nama_tarif}
          errorText={errors.nama_tarif}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              nama_tarif: event.target.value,
            }));
          }}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <FormInputDatepicker
            labelText="Tanggal Awal"
            value={formData.start_date && parseISO(formData.start_date)}
            errorText={errors.start_date}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                start_date: format(event.value, "yyyy-MM-dd"),
              }));
            }}
          />
          <FormInputDatepicker
            labelText="Tanggal Akhir"
            value={formData.end_date && parseISO(formData.end_date)}
            errorText={errors.end_date}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                end_date: format(event.value, "yyyy-MM-dd"),
              }));
            }}
          />
        </div>
        <FormInputSwitch
          labelText="Memakai Tarif RS"
          errorText={errors.tarif_rs}
          checkedValue={formData.tarif_rs!}
          onChange={(e: any) => {
            setFormData((previous) => ({
              ...previous,
              tarif_rs: e.value,
            }));
          }}
        />
        {/* <FormInputSwitch
          labelText="Is Active"
          errorText={errors.is_active}
          checkedValue={formData.is_active!}
          onChange={(e: any) => {
            setFormData((previous) => ({
              ...previous,
              is_active: e.value,
            }));
          }}
        /> */}
      </form>
    </Panel>
  );
};

const ContainerUpdate = function ({
  dataForm,
  setFormState,
  refreshData,
  companyList,
}: {
  dataForm: BukuTarif;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
  companyList: Company[];
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [formData, setFormData] = useState<FormBukuTarif>({
    id_buku_tarif: undefined,
    kode_company: "",
    nama_tarif: "",
    start_date: "",
    end_date: "",
    is_active: false,
    tarif_rs: false,
  });
  const [errors, setErrors] = useState<FormErrorBukuTarif>({});

  useEffect(() => {
    if (dataForm) {
      setFormData({
        id_buku_tarif: dataForm.id_buku_tarif,
        kode_company: dataForm.kode_company,
        nama_tarif: dataForm.nama_buku_tarif,
        start_date: dataForm.start_date,
        end_date: dataForm.end_date,
        is_active: dataForm.active,
        tarif_rs: dataForm.memakai_tarif_rs,
      });
    }
    console.log(dataForm);
  }, [dataForm]);

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLayoutLoading(true);
    try {
      const result = await updateBukuTarif(formData);
      setLayoutLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        refreshData();
      } else {
        const validateError: FormErrorBukuTarif = result.errorData;
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
          <FormButton type="submit" form="form-update" labelText="Submit" />
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
          required={true}
          filter="true"
          labelText="Company"
          value={formData?.kode_company}
          errorText={errors?.kode_company}
          options={companyList}
          optionLabel="nama_company"
          optionValue="kode_company"
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_company: event.value,
            }));
          }}
        />
        <FormInputText
          labelText="Nama Buku Tarif"
          value={formData.nama_tarif}
          errorText={errors.nama_tarif}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              nama_tarif: event.target.value,
            }));
          }}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <FormInputDatepicker
            labelText="Tanggal Awal"
            value={formData.start_date && parseISO(formData.start_date)}
            errorText={errors.start_date}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                start_date: format(event.value, "yyyy-MM-dd"),
              }));
            }}
          />
          <FormInputDatepicker
            labelText="Tanggal Akhir"
            value={formData.end_date && parseISO(formData.end_date)}
            errorText={errors.end_date}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                end_date: format(event.value, "yyyy-MM-dd"),
              }));
            }}
          />
        </div>
        <FormInputSwitch
          labelText="Memakai Tarif RS"
          errorText={errors.tarif_rs}
          checkedValue={formData.tarif_rs!}
          onChange={(e: any) => {
            setFormData((previous) => ({
              ...previous,
              tarif_rs: e.value,
            }));
          }}
        />
        <FormInputSwitch
          labelText="Is Active"
          errorText={errors.is_active}
          checkedValue={formData.is_active!}
          onChange={(e: any) => {
            setFormData((previous) => ({
              ...previous,
              is_active: e.value,
            }));
          }}
        />
      </form>
    </Panel>
  );
};

export default BukuTarifTemplate;
