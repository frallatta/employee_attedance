"use client";

import { useContext, useEffect, useRef, useState } from "react";

import useSWR, { KeyedMutator } from "swr";
import axiosClient from "@/lib/axiosClient";
import FormInputText from "@/component/FormInputText";
import FormButton from "@/component/FormButton";
import { Dispatch, SetStateAction } from "react";
import { Panel } from "primereact/panel";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Profile,
  FormProfile,
  FormErrorProfile,
  FormChangePassword,
  FormErrorChangePassword,
} from "@/types/profile";
import { changeImage, changePhoneNumber, changePassword } from "./action";
import FormInputSwitch from "@/component/FormInputSwitch";
import FormInputPassword from "@/component/FormInputPassword";
import { Image as PrimeImage } from "primereact/image";
import Image from "next/image";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Menu } from "primereact/menu";
import { signOut } from "next-auth/react";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const ProfileTemplate = () => {
  const [formState, setFormState] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const parentRef = useRef<HTMLDivElement>(null);
  const [selectedActionMenu, setSelectedActionMenu] = useState<string | null>(
    null
  );
  const menuRef = useRef<any>(null);

  const fetcherDataProfile = () =>
    axiosClient
      .get("/auth/profile")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const {
    data: profileData,
    error,
    isLoading,
    mutate,
  }: {
    data: Profile;
    error: any;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
  } = useSWR("/profile", fetcherDataProfile);

  const items = [
    {
      label: "Change Phone Number",
      command: () => confirmChangePhoneNumber(),
      // icon: "pi pi-refresh",
    },
    {
      label: "Change Password",
      command: () => confirmChangePassword(),
      // icon: "pi pi-upload",
    },
    {
      label: "Change Image",
      command: () => confirmChangeImage(),
      // icon: "pi pi-upload",
    },
  ];
  const confirmChangePhoneNumber = () => {
    parentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setFormState("change-phone-number");
  };

  const confirmChangePassword = () => {
    parentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setFormState("change-password");
  };

  const confirmChangeImage = () => {
    parentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setFormState("change-image");
  };

  return (
    <div ref={parentRef}>
      {formState === "change-phone-number" && (
        <ContainerPhoneNumber
          dataForm={profileData!}
          setFormState={setFormState}
          refreshData={mutate}
        />
      )}
      {formState === "change-password" && (
        <ContainerChangePassword
          dataForm={profileData!}
          setFormState={setFormState}
          refreshData={mutate}
        />
      )}
      {formState === "change-image" && (
        <ContainerChangeImage
          dataForm={profileData!}
          setFormState={setFormState}
          refreshData={mutate}
        />
      )}
      <div className="flex justify-end mb-2">
        <Menu model={items} popup ref={menuRef} id="popup_menu_profile" />
        <FormButton
          icon="pi pi-list"
          labelText=""
          onClick={(event: any) => menuRef.current.toggle(event)}
          aria-controls="popup_menu_profile"
          aria-haspopup
        />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="w-full">
          <PrimeImage
            src={`${backendUrl}/${profileData.image_file_url}`}
            alt="Image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            preview
          />
        </div>
        <div className="col-span-2 ">
          <div className="grid md:grid-cols-2 gap-2">
            <FormInputText
              labelText="Name"
              value={profileData.full_name}
              readOnly={true}
            />
            <FormInputText
              labelText="Email"
              value={profileData.email}
              readOnly={true}
            />
            <FormInputText
              labelText="Phone Number"
              value={profileData.phone_number}
              readOnly={true}
            />
            <FormInputText
              labelText="Job Position"
              value={profileData.job_position}
              readOnly={true}
            />
            <FormInputSwitch
              labelText="Is Admin"
              checkedValue={profileData.is_admin!}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ContainerPhoneNumber = function ({
  dataForm,
  setFormState,
  refreshData,
}: {
  dataForm: Profile;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [formData, setFormData] = useState<FormProfile>({
    phone_number: "",
  });
  const [errors, setErrors] = useState<FormErrorProfile>({});

  useEffect(() => {
    if (dataForm) {
      setFormData({
        phone_number: dataForm.phone_number,
      });
    }
  }, [dataForm]);

  const formSubmit = async (e: any) => {
    e.preventDefault();

    setErrors({});
    setLayoutLoading(true);
    try {
      const result = await changePhoneNumber(
        dataForm.id,
        formData.phone_number!
      );
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
        const validateError: FormErrorProfile = result.errorData;
        if (result.errorMessage) {
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
            form="form-change-phone-number"
            labelText="Submit"
          />
        </div>
      </div>
    );
  };

  return (
    <Panel header="Change Phone Number" footerTemplate={footerTemplate}>
      <form
        className="flex flex-col gap-2"
        onSubmit={formSubmit}
        id="form-change-phone-number"
      >
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
      </form>
    </Panel>
  );
};

const ContainerChangePassword = function ({
  dataForm,
  setFormState,
  refreshData,
}: {
  dataForm: Profile;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [formData, setFormData] = useState<FormChangePassword>({
    current_password: "",
    new_password: "",
  });
  const [errors, setErrors] = useState<FormErrorChangePassword>({});

  const formSubmit = async (e: any) => {
    e.preventDefault();

    setErrors({});
    setLayoutLoading(true);
    try {
      const result = await changePassword(
        dataForm.id,
        formData.current_password!,
        formData.new_password!
      );
      console.log(result);
      setLayoutLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        signOut({ callbackUrl: "/auth/login" });
      } else {
        const validateError: FormErrorProfile = result.errorData;
        if (result.errorMessage) {
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
            form="form-change-password"
            labelText="Submit"
          />
        </div>
      </div>
    );
  };

  return (
    <Panel header="Change Password" footerTemplate={footerTemplate}>
      <form
        className="flex flex-col gap-2"
        onSubmit={formSubmit}
        id="form-change-password"
      >
        <FormInputPassword
          labelText="Current Password"
          value={formData.current_password}
          errorText={errors.current_password}
          feedback={false}
          toggleMask={true}
          onChange={(event: any) => {
            setFormData((previous: any) => ({
              ...previous,
              current_password: event.target.value,
            }));
          }}
        />
        <FormInputPassword
          labelText="New Password"
          value={formData.new_password}
          errorText={errors.new_password}
          feedback={false}
          toggleMask={true}
          onChange={(event: any) => {
            setFormData((previous: any) => ({
              ...previous,
              new_password: event.target.value,
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
  dataForm: Profile;
  setFormState: Dispatch<SetStateAction<string | null>>;
  refreshData: KeyedMutator<any>;
}) {
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const [formData, setFormData] = useState<FormProfile>({
    image_file_url: "",
  });
  const [errors, setErrors] = useState<FormErrorProfile>({});
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
          const result = await changeImage(dataForm.id, formData);
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
            const validateError: FormErrorProfile = result.errorData;
            if (result.errorMessage) {
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
    <Panel header="Change Profile Image" footerTemplate={footerTemplate}>
      <div className="min-h-96">
        <div className="flex flex-col">
          <div>
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
          </div>
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
              <Image
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                width={480}
                height={480}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
      </div>
    </Panel>
  );
};

export default ProfileTemplate;
