"use client";

import { useContext, useEffect, useRef, useState } from "react";

import FormDatatable from "@/component/FormDatatable";
import { Column } from "primereact/column";
import axiosClient from "@/lib/axiosClient";
import FormButton from "@/component/FormButton";
import "react-image-crop/dist/ReactCrop.css";
import { format, parseISO } from "date-fns";
import FormInputDatepicker from "@/component/FormInputDatepicker";
import { DataTableFilterMeta, DataTableStateEvent } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";

const csrf = () => axiosClient.get("/sanctum/csrf-cookie");

const AttendanceTemplate = () => {
  const [dtFilter, setDtFilter] = useState<DataTableFilterMeta>({
    "employee.full_name": { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const parentRef = useRef<HTMLDivElement>(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataFilter, setDataFilter] = useState({
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  });

  const searchData = async () => {
    setLoading(true);
    const resAttendanceData = await axiosClient.get("/attendances/", {
      params: {
        attendanceDate: `${dataFilter.start_date}|${dataFilter.end_date}`,
      },
    });
    setAttendanceData(resAttendanceData.data);
    setLoading(false);
  };

  return (
    <div ref={parentRef}>
      <div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormInputDatepicker
            labelText="Tanggal Awal"
            value={dataFilter.start_date && parseISO(dataFilter.start_date)}
            onChange={(event: any) => {
              setDataFilter((previous) => ({
                ...previous,
                start_date: format(event.value, "yyyy-MM-dd"),
              }));
            }}
          />
          <FormInputDatepicker
            labelText="Tanggal Akhir"
            value={dataFilter.end_date && parseISO(dataFilter.end_date)}
            onChange={(event: any) => {
              setDataFilter((previous) => ({
                ...previous,
                end_date: format(event.value, "yyyy-MM-dd"),
              }));
            }}
          />
        </div>
        <FormButton
          classNames="mt-4"
          labelText="Search"
          onClick={() => searchData()}
        />
      </div>
      <FormDatatable
        className="mt-4"
        paginator={true}
        rows={10}
        loading={loading}
        rowsPerPageOptions={[10, 25, 50, 100]}
        data={attendanceData}
        filter="true"
        filters={dtFilter}
        onFilter={(e: DataTableStateEvent) => {
          setDtFilter(e.filters);
        }}
        dataKey="id"
        sortField="attendance_date"
        sortOrder={-1}
      >
        <Column
          field="employee.full_name"
          header="Name"
          sortable
          filter
          filterPlaceholder="Search by name"
        ></Column>
        <Column field="attendance_date" header="Date" sortable></Column>
        <Column
          field="attendance_in"
          header="Check In"
          body={(data) => format(data.attendance_in, "HH:mm")}
        ></Column>
        <Column
          field="attendance_out"
          header="Check Out"
          body={(data) => format(data.attendance_out, "HH:mm")}
        ></Column>
      </FormDatatable>
    </div>
  );
};

export default AttendanceTemplate;
