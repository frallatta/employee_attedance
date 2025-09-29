import {
  BentukObat,
  DosisObat,
  EfekSamping,
  GolonganProduksi,
  ItemGroup,
  KategoriObat,
  KontraIndikasi,
} from "./master";

export interface ItemData {
  kode_barang: string;
  nama_barang: string;
  nama_bentuk: string;
  nama_group: string;
  nama_dosis: string;
  persamaan_obat: string;
  discontinued: boolean;
  indikasi_umum: string;
  kode_group?: string;
  kode_kontra_indikasi?: string;
  kode_efek_samping?: string;
  kode_golongan?: string;
  kode_bentuk?: string;
  persamaan_obat_id?: string;
  barcode?: string;
  kode_dosis?: string;
  kode_kategori?: string;
  is_active: boolean;
}

export interface FormItemData {
  kode_barang?: string;
  nama_barang?: string;
  indikasi_umum?: string;
  kode_group?: string;
  kode_kontra_indikasi?: string;
  kode_efek_samping?: string;
  kode_golongan?: string;
  kode_bentuk?: string;
  persamaan_obat_id?: string;
  barcode?: string;
  kode_dosis?: string;
  kode_kategori?: string;
}

export interface FormErrorItemData {
  kode_barang?: string[];
  nama_barang?: string[];
  indikasi_umum?: string[];
  kode_group?: string[];
  kode_kontra_indikasi?: string[];
  kode_efek_samping?: string[];
  kode_golongan?: string[];
  kode_bentuk?: string[];
  persamaan_obat_id?: string[];
  barcode?: string[];
  kode_dosis?: string[];
  kode_kategori?: string[];
  message?: string[];
}

export interface FormOptionList {
  itemGroupList: ItemGroup[];
  bentukObatList: BentukObat[];
  kontraIndikasiList: KontraIndikasi[];
  kategoriObatList: KategoriObat[];
  efekSampingList: EfekSamping[];
  golonganProduksiList: GolonganProduksi[];
  dosisObatList: DosisObat[];
}

export interface ItemUom {
  type: string;
  kode_uom: string;
  nama_uom: string;
  jumlah_konversi: number;
  nama_satuan: string;
  priority: boolean;
}

export interface FormItemUom {
  type?: string;
  kode_barang?: string;
  kode_uom?: string;
  nilai_konversi?: number;
  is_primary?: boolean;
}

export interface FormErrorItemUom {
  type?: string[];
  kode_barang?: string[];
  kode_uom?: string[];
  nilai_konversi?: string[];
  is_primary?: string[];
  message?: string[];
}

export interface ItemKandungan {
  kode_kandungan: string;
  nama_kandungan: string;
  jumlah_kandungan: number;
  satuan_kandungan: string;
}

export interface FormItemKandungan {
  kode_barang?: string;
  kode_kandungan?: string;
  jumlah_kandungan?: number;
  satuan_kandungan?: string;
}

export interface FormErrorItemKandungan {
  kode_barang?: string[];
  kode_kandungan?: string[];
  jumlah_kandungan?: string[];
  satuan_kandungan?: string[];
  message?: string[];
}

export interface ItemLokasi {
  id_lokasi_barang: number;
  site_id: string;
  nama_site: string;
  kode_lokasi: string;
  nama_lokasi_barang: string;
  kode_barang: string;
  nama_barang: string;
  fix_stock: number;
  is_set_fix_stock: boolean;
}

export type FormMappingItemLokasi = "ITEM_TO_LOCATION" | "LOCATION_TO_ITEM";

export interface FormItemLokasi {
  site_id?: string;
  kode_lokasi?: string;
  kode_barang?: string;
  fix_stock?: number;
  is_set_fix_stock?: boolean;
}

export interface FormErrorItemLokasi {
  site_id?: string[];
  kode_lokasi?: string[];
  kode_barang?: string[];
  fix_stock?: string[];
  is_set_fix_stock?: string[];
  message?: string[];
}

export interface ItemDistributor {
  id_mapping_kode_barang: number;
  id_distributor: number;
  kode_barang: string;
  nama_barang: string;
  is_active: boolean;
  kode_distributor: string;
  nama_distributor: string;
  uom_beli: string;
  nama_uom: string;
  satuan_uom: string;
  nilai_konversi: number;
  discount: number;
  pricelist: number;
  level_purchasing: number;
}

export interface FormItemDistributor {
  kode_barang?: string;
  kode_distributor?: string;
  kode_uom?: string;
  disc_distributor?: number;
  hna_distributor?: number;
  level_purchasing_distributor?: number;
  is_active_distributor?: boolean;
}

export interface FormErrorItemDistributor {
  kode_barang?: string[];
  kode_distributor?: string[];
  kode_uom?: string[];
  disc_distributor?: string[];
  hna_distributor?: string[];
  level_purchasing_distributor?: string[];
  is_active_distributor?: string[];
  message?: string[];
}

export interface ItemPrincipal {
  id_mapping_kode_barang: number;
  id_principal: number;
  kode_barang: string;
  nama_barang: string;
  is_active: boolean;
  kode_distributor: string;
  kode_principal: string;
  nama_principal: string;
  uom_beli: string;
  nama_uom: string;
  satuan_uom: string;
  nilai_konversi: number;
  discount: number;
  pricelist: number;
  level_purchasing: number;
}

export interface FormItemPrincipal {
  kode_barang?: string;
  kode_distributor?: string;
  kode_principal?: string;
  kode_uom?: string;
  disc_principal?: number;
  hna_principal?: number;
  level_purchasing_principal?: number;
  is_active_principal?: boolean;
}

export interface FormErrorItemPrincipal {
  kode_barang?: string[];
  kode_distributor?: string[];
  kode_principal?: string[];
  kode_uom?: string[];
  disc_principal?: string[];
  hna_principal?: string[];
  level_purchasing_principal?: string[];
  is_active_principal?: string[];
  message?: string[];
}

export interface ItemBasePrice {
  kode_barang: string;
  baseprice: number;
  is_update_purchasing: boolean;
  is_update_salesprice: boolean;
  is_centralize: boolean;
}
