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
import { ItemGroup, FormItemGroup, FormErrorItemGroup } from "@/types/master";
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
import { activateItemGroup, createItemGroup, updateItemGroup } from "./action";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const ItemGroupTemplate = () => {
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    kode_group: { value: "", matchMode: FilterMatchMode.CONTAINS },
    nama_group: { value: "", matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedDataRow, setSelectedDataRow] = useState<ItemGroup | null>(
    null
  );
  const [selectedFormUpdate, setSelectedFormUpdate] = useState<ItemGroup>();
  const contextMenuRef = useRef<ContextMenu>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const menuModel: MenuItem[] = [
    // {
    //   label: "Action",
    //   items: [
    {
      label: "Update",
      icon: "pi pi-pen-to-square",
      command: () => confirmUpdate(),
    },
    {
      label: selectedDataRow?.is_active ? "Deactive" : "Active",
      icon: selectedDataRow?.is_active ? "pi pi-times" : "pi pi-check",
      command: () => confirmActivate(),
    },
    //   ],
    // },
  ];

  const fetcherDataItemGroup = () =>
    axiosClient
      .get("/api/master/item-group")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const { data, error, isLoading, mutate } = useSWR(
    "/api/master/item-group",
    fetcherDataItemGroup
  );

  const activateStatus = async () => {
    setLayoutLoading(true);
    try {
      const formData: FormItemGroup = {
        kode_group: selectedDataRow?.kode_group,
      };

      const result = await activateItemGroup(formData);
      setLayoutLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        mutate();
      } else {
        const validateError: FormErrorItemGroup = result.errorData;
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

  const confirmUpdate = () => {
    parentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setSelectedFormUpdate(selectedDataRow!);
    setFormState("update");
  };

  // const ActionButton = (rowData: any) => {
  //   const menuRef = useRef<Menu>(null);
  //   const items = [
  //     {
  //       label: "Action",
  //       items: [
  //         {
  //           label: "Update",
  //           icon: "pi pi-pen-to-square",
  //         },
  //         {
  //           label: rowData.is_active ? "Deactive" : "Active",
  //           icon: rowData.is_active ? "pi pi-times" : "pi pi-check",
  //         },
  //       ],
  //     },
  //   ];

  //   return (
  //     <div className="flex align-center justify-center">
  //       <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedProduct(null)} />
  //       <Button
  //         icon="pi pi-bars"
  //         onClick={(event) => {
  //           menuRef.current?.toggle(event);
  //         }}
  //         aria-controls="popup_menu_datatable"
  //         aria-haspopup
  //       />
  //     </div>
  //   );
  // };

  return (
    <div ref={parentRef}>
      <ContextMenu
        model={menuModel}
        ref={contextMenuRef}
        onHide={() => setSelectedDataRow(null)}
      />
      {formState === "create" && (
        <ContainerCreate setFormState={setFormState} refreshData={mutate} />
      )}
      {formState === "update" && (
        <ContainerUpdate
          dataForm={selectedFormUpdate!}
          setFormState={setFormState}
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
        dataKey="id"
        sortField="kode_group"
        sortOrder={1}
      >
        <Column
          field="kode_group"
          header="Kode"
          sortable
          filter
          filterPlaceholder="Search by code"
        ></Column>
        <Column
          field="nama_group"
          header="Nama"
          sortable
          filter
          filterPlaceholder="Search by name"
        ></Column>
        <Column
          dataType="boolean"
          field="is_active"
          header="Status"
          body={(rowData: ItemGroup) => DtBooleanColumn(rowData.is_active)}
          filter
          filterElement={DtBooleanColumnFilter}
        ></Column>
        {/* <Column body={ActionButton}></Column> */}
      </FormDatatable>
    </div>
  );
};

const ContainerCreate = function ({
  setFormState,
  refreshData,
}: {
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialForm: FormItemGroup = {
    kode_group: "",
    nama_group: "",
  };
  const [formData, setFormData] = useState<FormItemGroup>(initialForm);
  const [errors, setErrors] = useState<FormErrorItemGroup>({});

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      setLayoutLoading(false);
      const result = await createItemGroup(formData);
      setLayoutLoading(false);
      setLoading(false);
      console.log(result);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        setFormData(initialForm);
        refreshData();
      } else {
        const validateError: FormErrorItemGroup = result.errorData;
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
      setLoading(false);
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
        <FormInputText
          labelText="Kode"
          value={formData.kode_group}
          errorText={errors.kode_group}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_group: event.target.value,
            }));
          }}
        />
        <FormInputText
          labelText="Nama"
          value={formData.nama_group}
          errorText={errors.nama_group}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              nama_group: event.target.value,
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
}: {
  dataForm: ItemGroup;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [formData, setFormData] = useState<FormItemGroup>({
    kode_group: "",
    nama_group: "",
  });
  const [errors, setErrors] = useState<FormErrorItemGroup>({});

  useEffect(() => {
    if (dataForm) {
      setFormData({
        kode_group: dataForm.kode_group,
        nama_group: dataForm.nama_group,
      });
    }
  }, [dataForm]);

  const formSubmit = async (e: any) => {
    e.preventDefault();

    setErrors({});
    setLayoutLoading(true);
    try {
      const result = await updateItemGroup(formData);
      setLayoutLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        setFormState(null);
        refreshData();
      } else {
        const validateError: FormErrorItemGroup = result.errorData;
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
        <FormInputText
          labelText="Kode"
          value={formData.kode_group}
          errorText={errors.kode_group}
          disabled={true}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              kode_group: event.target.value,
            }));
          }}
        />
        <FormInputText
          labelText="Nama"
          value={formData.nama_group}
          errorText={errors.nama_group}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              nama_group: event.target.value,
            }));
          }}
        />
      </form>
    </Panel>
  );
};

export default ItemGroupTemplate;
