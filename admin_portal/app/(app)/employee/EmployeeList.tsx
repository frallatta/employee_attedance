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
import { Employee, FormEmployee, FormErrorEmployee } from "@/types/employee";
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
import { createEmployee, updateEmployee, updateEmployeeImage } from "./action";
import FormInputSwitch from "@/component/FormInputSwitch";
import FormInputPassword from "@/component/FormInputPassword";
import { Image as PrimeImage } from "primereact/image";
import Image from "next/image";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const EmployeeTemplate = () => {
  const [formState, setFormState] = useState<string | null>(null);
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    full_name: { value: "", matchMode: FilterMatchMode.CONTAINS },
    email: { value: "", matchMode: FilterMatchMode.CONTAINS },
    phone_number: { value: "", matchMode: FilterMatchMode.CONTAINS },
    job_position: { value: "", matchMode: FilterMatchMode.CONTAINS },
    is_admin: { value: "", matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [selectedDataRow, setSelectedDataRow] = useState<Employee | null>(null);
  const [selectedFormUpdate, setSelectedFormUpdate] = useState<Employee>();
  const contextMenuRef = useRef<ContextMenu>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [expandedRows, setExpandedRows] = useState(null);
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
      label: "Reset Password",
      icon: "pi pi-lock",
      command: () => confirmResetPassword(),
    },
    {
      label: "Change Image",
      icon: "pi pi-image",
      command: () => confirmChangeImage(),
    },
    {
      label: selectedDataRow?.is_active ? "Deactive" : "Active",
      icon: selectedDataRow?.is_active ? "pi pi-times" : "pi pi-check",
      command: () => confirmActivate(),
    },
    //   ],
    // },
  ];

  const fetcherDataEmployee = () =>
    axiosClient
      .get("/employees/")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const { data, error, isLoading, mutate } = useSWR(
    "/employee",
    fetcherDataEmployee
  );

  const activateStatus = async () => {
    setLayoutLoading(true);
    try {
      const formData: FormEmployee = {
        is_active: !selectedDataRow?.is_active,
      };

      const result = await updateEmployee(selectedDataRow!.id, formData);
      setLayoutLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        mutate();
      } else {
        const validateError: FormErrorEmployee = result.errorData;
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

  const confirmResetPassword = () => {
    parentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setSelectedFormUpdate(selectedDataRow!);
    setFormState("reset-password");
  };

  const confirmChangeImage = () => {
    parentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setSelectedFormUpdate(selectedDataRow!);
    setFormState("change-image");
  };

  const onRowExpand = (event: any) => {
    const newExpandedRows: any = {};
    newExpandedRows[event.data.id] = true;
    setExpandedRows(newExpandedRows);
  };

  const onRowCollapse = (event: any) => {
    setExpandedRows(null);
  };

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
      {formState === "reset-password" && (
        <ContainerResetPassword
          dataForm={selectedFormUpdate!}
          setFormState={setFormState}
          refreshData={mutate}
        />
      )}
      {formState === "change-image" && (
        <ContainerChangeImage
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
        expandedRows={expandedRows}
        // onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
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
        sortField="full_name"
        sortOrder={1}
      >
        <Column expander={true} style={{ width: "5rem" }} />
        <Column
          field="full_name"
          header="Name"
          sortable
          filter
          filterPlaceholder="Search by name"
        ></Column>
        <Column
          field="email"
          header="Email"
          sortable
          filter
          filterPlaceholder="Search by email"
        ></Column>
        <Column
          field="phone_number"
          header="Phone Number"
          sortable
          filter
          filterPlaceholder="Search by phone number"
        ></Column>
        <Column
          field="job_position"
          header="Job Position"
          sortable
          filter
          filterPlaceholder="Search by job position"
        ></Column>
        <Column
          dataType="boolean"
          field="is_admin"
          header="Admin"
          body={(rowData: Employee) => DtBooleanColumn(rowData.is_admin)}
          filter
          filterElement={DtBooleanColumnFilter}
        ></Column>
        <Column
          dataType="boolean"
          field="is_active"
          header="Status"
          body={(rowData: Employee) => DtBooleanColumn(rowData.is_active)}
          filter
          filterElement={DtBooleanColumnFilter}
        ></Column>
        {/* <Column body={ActionButton}></Column> */}
      </FormDatatable>
    </div>
  );
};

const rowExpansionTemplate = (data: any) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="w-full">
        <PrimeImage
          src={`${backendUrl}/${data.image_file_url}`}
          alt="Image"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          preview
        />
      </div>
      <div className="col-span-2 ">
        <div className="grid md:grid-cols-2 gap-2">
          <FormInputText
            labelText="Name"
            value={data.full_name}
            readOnly={true}
          />
          <FormInputText labelText="Email" value={data.email} readOnly={true} />
          <FormInputText
            labelText="Phone Number"
            value={data.phone_number}
            readOnly={true}
          />
          <FormInputText
            labelText="Job Position"
            value={data.job_position}
            readOnly={true}
          />
          <FormInputSwitch
            labelText="Is Admin"
            checkedValue={data.is_admin!}
            readOnly={true}
          />
        </div>
      </div>
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
  const initialForm: FormEmployee = {
    full_name: "",
    email: "",
    password: "",
    job_position: "",
    phone_number: "",
    is_admin: false,
  };
  const [formData, setFormData] = useState<FormEmployee>(initialForm);
  const [errors, setErrors] = useState<FormErrorEmployee>({});

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setLayoutLoading(true);
    try {
      setLayoutLoading(false);
      const result = await createEmployee(formData);
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
        const validateError: FormErrorEmployee = result.errorData;
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
          labelText="Name"
          value={formData.full_name}
          errorText={errors.full_name}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              full_name: event.target.value,
            }));
          }}
        />
        <div className="grid md:grid-cols-2 gap-2">
          <FormInputText
            labelText="Email"
            value={formData.email}
            errorText={errors.email}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                email: event.target.value,
              }));
            }}
          />
          <FormInputText
            labelText="Password"
            value={formData.password}
            errorText={errors.password}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                password: event.target.value,
              }));
            }}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          <FormInputText
            labelText="Phone Number"
            value={formData.phone_number}
            errorText={errors.phone_number}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                phone_number: event.target.value,
              }));
            }}
          />
          <FormInputText
            labelText="Job Position"
            value={formData.job_position}
            errorText={errors.job_position}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                job_position: event.target.value,
              }));
            }}
          />
        </div>
        <FormInputSwitch
          labelText="Is Admin"
          helperText="Enable this to set employee for admin login"
          checkedValue={formData.is_admin!}
          errorText={errors.is_admin}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              is_admin: event.value,
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
  dataForm: Employee;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [formData, setFormData] = useState<FormEmployee>({
    full_name: "",
    email: "",
    job_position: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState<FormErrorEmployee>({});

  useEffect(() => {
    if (dataForm) {
      setFormData({
        full_name: dataForm.full_name,
        email: dataForm.email,
        job_position: dataForm.job_position,
        phone_number: dataForm.phone_number,
        is_admin: dataForm.is_admin,
      });
    }
  }, [dataForm]);

  const formSubmit = async (e: any) => {
    e.preventDefault();

    setErrors({});
    setLayoutLoading(true);
    try {
      const result = await updateEmployee(dataForm.id, formData);
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
        const validateError: FormErrorEmployee = result.errorData;
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
          labelText="Name"
          value={formData.full_name}
          errorText={errors.full_name}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              full_name: event.target.value,
            }));
          }}
        />
        <FormInputText
          labelText="Email"
          value={formData.email}
          errorText={errors.email}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              email: event.target.value,
            }));
          }}
        />
        <div className="grid md:grid-cols-2 gap-2">
          <FormInputText
            labelText="Phone Number"
            value={formData.phone_number}
            errorText={errors.phone_number}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                phone_number: event.target.value,
              }));
            }}
          />
          <FormInputText
            labelText="Job Position"
            value={formData.job_position}
            errorText={errors.job_position}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                job_position: event.target.value,
              }));
            }}
          />
        </div>
        <FormInputSwitch
          labelText="Is Admin"
          helperText="Enable this to set employee for admin login"
          checkedValue={formData.is_admin!}
          errorText={errors.is_admin}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              is_admin: event.value,
            }));
          }}
        />
      </form>
    </Panel>
  );
};

const ContainerResetPassword = function ({
  dataForm,
  setFormState,
  refreshData,
}: {
  dataForm: Employee;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [formData, setFormData] = useState<FormEmployee>({
    password: "",
  });
  const [errors, setErrors] = useState<FormErrorEmployee>({});

  const formSubmit = async (e: any) => {
    e.preventDefault();

    setErrors({});
    setLayoutLoading(true);
    try {
      const formResetPassword: FormEmployee = {
        password: formData.password,
      };
      const result = await updateEmployee(dataForm.id, formResetPassword);
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
        const validateError: FormErrorEmployee = result.errorData;
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
          <FormButton
            type="submit"
            form="form-reset-password"
            labelText="Submit"
          />
        </div>
      </div>
    );
  };

  return (
    <Panel header="Reset Password" footerTemplate={footerTemplate}>
      <form
        className="flex flex-col gap-2"
        onSubmit={formSubmit}
        id="form-reset-password"
      >
        <FormInputPassword
          labelText="New Password"
          value={formData.password}
          errorText={errors.password}
          feedback={false}
          toggleMask={true}
          onChange={(event: any) => {
            setFormData((previous) => ({
              ...previous,
              password: event.target.value,
            }));
          }}
        />
      </form>
    </Panel>
  );
};

const ContainerChangeImage = function ({
  dataForm,
  setFormState,
  refreshData,
}: {
  dataForm: Employee;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [formData, setFormData] = useState<FormEmployee>({
    image_file_url: "",
  });
  const [errors, setErrors] = useState<FormErrorEmployee>({});
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef<any>(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<any>(null);
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [aspect, setAspect] = useState(1 / 1);
  const inputFileRef = useRef<any>(null);

  const centerAspectCrop = (mediaWidth: any, mediaHeight: any, aspect: any) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  };

  const onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCrop(undefined); // Makes crop preview update between images.
      const fileUrl = URL.createObjectURL(file);
      setImgSrc(fileUrl);
      // const reader = new FileReader();
      // reader.addEventListener("load", () =>
      //   setImgSrc(reader.result?.toString() || "")
      // );
      // reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: any) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const submitImage = async () => {
    if (completedCrop) {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");
      if (!image) {
        return toastRef.current.show({
          severity: "warn",
          summary: "Failed",
          detail: "Image is not selected.",
        });
      }

      const crop = completedCrop;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext("2d");
      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio * scaleX;
      canvas.height = crop.height * pixelRatio * scaleY;

      if (!ctx) {
        return toastRef.current.show({
          severity: "warn",
          summary: "Failed",
          detail: "Image is not selected.",
        });
      }
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      const base64Image = canvas.toDataURL("image/jpeg");
      if (base64Image) {
        const fileType = base64Image.split(";")[0].split(":")[1];

        const buffer = Buffer.from(
          base64Image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const file = new File([buffer], "profile-picture.jpeg", {
          type: fileType,
        });
        setLayoutLoading(true);
        try {
          var formData = new FormData();
          formData.append("_method", "put");
          formData.append("file", file);
          const result = await updateEmployeeImage(dataForm.id, formData);
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
            const validateError: FormErrorEmployee = result.errorData;
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
    } else {
      return toastRef.current.show({
        severity: "warn",
        summary: "Failed",
        detail: "No Image.",
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
          <FormButton labelText="Submit" onClick={(e: any) => submitImage()} />
        </div>
      </div>
    );
  };

  return (
    <Panel header="Change Employee Image" footerTemplate={footerTemplate}>
      <div className="min-h-96">
        <FormButton
          classNames="mb-4"
          labelText="Pick Image"
          onClick={() => {
            inputFileRef.current.click();
          }}
        />
        <input
          type="file"
          ref={inputFileRef}
          className="hidden"
          onChange={onSelectFile}
          accept="image/*"
        />
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            // minWidth={400}
            minHeight={100}
            // circularCrop
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              // width={640}
              // height={640}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
      </div>
    </Panel>
  );
};

export default EmployeeTemplate;
