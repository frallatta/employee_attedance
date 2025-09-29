"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { classNames } from "primereact/utils";

import "primeicons/primeicons.css";
import { FormErrorLogin, FormLogin } from "@/types/auth";
import FormInputText from "@/component/FormInputText";
import FormInputPassword from "@/component/FormInputPassword";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { login } from "./action";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import Image from "next/image";

export default function Login({ callbackUrl }: { callbackUrl: string }) {
  const [formData, setFormData] = useState<FormLogin>({
    email: "",
    password: "",
  });
  const { setLayoutLoading, toastRef } = useContext(LayoutContext);
  const [errors, setErrors] = useState<FormErrorLogin>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const submitForm = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLayoutLoading(true);
    try {
      const result = await login(formData);
      console.log(result);
      if (!result.success) {
        const validateError: FormErrorLogin = result.errorData;
        setErrors(validateError);
        if (validateError.message) {
          toastRef.current.show({
            severity: "error",
            summary: "Failed",
            detail: result.errorMessage,
          });
        }
        setLayoutLoading(false);
        return;
      }

      const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

      signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: callbackUrl,
      });
      setLayoutLoading(false);
    } catch (e: any) {
      setLayoutLoading(false);
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: e.message,
      });
    }
  };

  const containerClassName = classNames(
    "surface-ground flex items-center justify-center min-h-screen overflow-hidden px-4 mx-4"
  );

  return (
    <div className={containerClassName}>
      <div className="flex flex-col items-center justify-center mx-8! px-8">
        <Image
          width={"320"}
          height={"320"}
          src={`/layout/images/logo-dark.svg`}
          alt="Sakai logo"
          className="mb-5 w-[6rem] shrink-0"
        />
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-screen md:w-2xl bg-white py-8 px-8 sm:px-16 flex flex-col gap-y-16"
            style={{ borderRadius: "53px" }}
          >
            <div className="text-center mb-5">
              <div className="text-900 text-3xl font-medium mb-3 mt-5">
                ADMIN HR PORTAL
              </div>
              <span className="text-600 font-medium">Sign in to continue</span>
            </div>
            <form onSubmit={submitForm} id="form-login">
              <div className="flex flex-col gap-y-8">
                <FormInputText
                  labelClassName="text-xl font-medium text-blue-900 "
                  labelText="Email"
                  errorText={errors.email}
                  value={formData.email}
                  onChange={(e: any) =>
                    setFormData((previous) => ({
                      ...previous,
                      email: e.target.value,
                    }))
                  }
                />
                <FormInputPassword
                  labelClassName="block text-xl font-medium text-blue-900"
                  feedback={false}
                  labelText="Password"
                  errorText={errors.password}
                  value={formData.password}
                  toggleMask={true}
                  onChange={(e: any) =>
                    setFormData((previous) => ({
                      ...previous,
                      password: e.target.value,
                    }))
                  }
                />
                <Button
                  type="submit"
                  form="form-login"
                  label="Sign In"
                  className="w-full p-3 text-xl"
                ></Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
