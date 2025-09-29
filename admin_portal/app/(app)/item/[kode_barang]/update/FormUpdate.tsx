"use client";

import { useContext, useEffect, useRef, useState } from "react";

import axiosClient from "@/lib/axiosClient";
import FormInputText from "@/component/FormInputText";
import FormButton from "@/component/FormButton";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  FormErrorItemData,
  FormItemData,
  FormOptionList,
  ItemData,
} from "@/types/item";
import FormInputTextarea from "@/component/FormInputTextarea";
import FormInputSelect from "@/component/FormInputSelect";
import { Divider } from "primereact/divider";
import { useRouter } from "next/navigation";
import { updateItem } from "./action";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const FormUpdateItem = ({
  optionData,
  itemData,
}: {
  optionData: FormOptionList;
  itemData: ItemData;
}) => {
  const [formData, setFormData] = useState<FormItemData>({
    kode_barang: itemData.kode_barang,
    nama_barang: itemData.nama_barang,
    indikasi_umum: itemData.indikasi_umum,
    kode_group: itemData.kode_group,
    kode_kontra_indikasi: itemData.kode_kontra_indikasi,
    kode_efek_samping: itemData.kode_efek_samping,
    kode_golongan: itemData.kode_golongan,
    kode_bentuk: itemData.kode_bentuk,
    persamaan_obat_id: itemData.persamaan_obat_id,
    barcode: itemData.barcode,
    kode_dosis: itemData.kode_dosis,
    kode_kategori: itemData.kode_kategori,
  });
  const [errors, setErrors] = useState<FormErrorItemData>();
  const { setLayoutLoading, toastRef } = useContext(LayoutContext);
  const router = useRouter();

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLayoutLoading(true);
    try {
      const result = await updateItem(formData);
      setLayoutLoading(false);

      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        router.replace("/master/item");
      } else {
        const validateError: FormErrorItemData = result.errorData;
        setErrors(validateError);
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

  return (
    <div>
      <form
        className="flex flex-col gap-2"
        onSubmit={formSubmit}
        id="form-create"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <FormInputText
            disabled={true}
            labelText="Kode"
            required={true}
            value={formData?.kode_barang}
            errorText={errors?.kode_barang}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_barang: event.target.value,
              }));
            }}
          />
          <FormInputText
            labelText="Nama"
            required={true}
            value={formData?.nama_barang}
            errorText={errors?.nama_barang}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                nama_barang: event.target.value,
              }));
            }}
          />
        </div>
        <div className="grid gap-4">
          <FormInputTextarea
            labelText="Indikasi Umum"
            value={formData?.indikasi_umum}
            errorText={errors?.indikasi_umum}
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                indikasi_umum: event.target.value,
              }));
            }}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <FormInputSelect
            filter={true}
            required={true}
            labelText="Item Group"
            value={formData?.kode_group}
            errorText={errors?.kode_group}
            options={optionData.itemGroupList}
            optionLabel="nama_group"
            optionValue="kode_group"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_group: event.value,
              }));
            }}
          />
          <FormInputSelect
            required={true}
            filter={true}
            labelText="Kontra Indikasi"
            value={formData?.kode_kontra_indikasi}
            errorText={errors?.kode_kontra_indikasi}
            options={optionData.kontraIndikasiList}
            optionLabel="nama_kontra_indikasi"
            optionValue="kode_kontra_indikasi"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_kontra_indikasi: event.value,
              }));
            }}
          />
          <FormInputSelect
            required={true}
            filter={true}
            labelText="Efek Samping"
            value={formData?.kode_efek_samping}
            errorText={errors?.kode_efek_samping}
            options={optionData.efekSampingList}
            optionLabel="nama_efek_samping"
            optionValue="kode_efek_samping"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_efek_samping: event.value,
              }));
            }}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormInputSelect
            filter={true}
            required={true}
            labelText="Golongan Produksi"
            value={formData?.kode_golongan}
            errorText={errors?.kode_golongan}
            options={optionData.golonganProduksiList}
            optionLabel="nama_golongan"
            optionValue="kode_golongan"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_golongan: event.value,
              }));
            }}
          />
          <FormInputSelect
            required={true}
            filter={true}
            labelText="Bentuk Obat"
            value={formData?.kode_bentuk}
            errorText={errors?.kode_bentuk}
            options={optionData.bentukObatList}
            optionLabel="nama_bentuk"
            optionValue="kode_bentuk"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_bentuk: event.value,
              }));
            }}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormInputSelect
            filter={true}
            required={true}
            labelText="Dosis Obat"
            value={formData?.kode_dosis}
            errorText={errors?.kode_dosis}
            options={optionData.dosisObatList}
            optionLabel="nama_dosis"
            optionValue="kode_dosis"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_dosis: event.value,
              }));
            }}
          />
          <FormInputSelect
            required={true}
            filter={true}
            labelText="Kategori Obat"
            value={formData?.kode_kategori}
            errorText={errors?.kode_kategori}
            options={optionData.kategoriObatList}
            optionLabel="nama_kategori"
            optionValue="kode_kategori"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                kode_kategori: event.value,
              }));
            }}
          />
        </div>
        <div className="grid  gap-4">
          <FormInputSelect
            filter={true}
            labelText="Persamaan Obat"
            value={formData?.persamaan_obat_id}
            errorText={errors?.persamaan_obat_id}
            options={[]}
            optionLabel="nama_barang"
            optionValue="id"
            onChange={(event: any) => {
              setFormData((previous) => ({
                ...previous,
                persamaan_obat: event.value,
              }));
            }}
          />
        </div>
      </form>
      <Divider />
      <div className="flex justify-start gap-2">
        <FormButton
          labelText="Cancel"
          severity="secondary"
          onClick={(e: any) => {
            e.preventDefault();
            router.push("/master/item");
          }}
        />
        <FormButton
          labelText="Submit"
          onClick={(e: any) => {
            e.preventDefault();
            formSubmit(e);
          }}
        />
      </div>
    </div>
  );
};

export default FormUpdateItem;
