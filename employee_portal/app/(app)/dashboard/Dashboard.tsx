"use client";
import { useState, useRef, useContext } from "react";
import "primeicons/primeicons.css";
import FormButton from "@/component/FormButton";
import { format } from "date-fns";
import { Attendance, Profile } from "@/types/profile";
import axiosClient from "@/lib/axiosClient";
import useSWR, { KeyedMutator } from "swr";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { attendAction } from "./action";
import { AttendanceType } from "@/types/enum";

const DashboardTemplate = ({ profileData }: { profileData: Profile }) => {
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const { toastRef, setLayoutLoading } = useContext(LayoutContext);
  const fetcherDataProfile = () =>
    axiosClient
      .get("/attendances/", {
        params: {
          employeeId: profileData.id,
          attendanceDate: `${currentDate}|${currentDate}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  const {
    data: attendanceData,
    error,
    isLoading,
    mutate,
  }: {
    data: Attendance[];
    error: any;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
  } = useSWR("/attendance", fetcherDataProfile);

  const employeeAttend = async (attendanceType: AttendanceType) => {
    setLayoutLoading(true);
    try {
      const result = await attendAction(profileData.id, attendanceType);
      setLayoutLoading(false);
      if (result.success) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        mutate();
      } else {
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

  return (
    <>
      <div>
        <div className="card">
          <p className="text-lg font-semibold">TODAY ATTENDANCE DATA</p>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-gray-200">
                <td className="py-3 px-4">
                  {format(new Date(), "yyyy-MM-dd")}
                </td>
                <td className="py-3 px-4">
                  {attendanceData.length === 0
                    ? ""
                    : attendanceData[0].attendance_in === null
                    ? ""
                    : format(attendanceData[0].attendance_in, "HH:mm")}
                </td>
                <td className="py-3 px-4">
                  {attendanceData.length === 0
                    ? ""
                    : attendanceData[0].attendance_out === null
                    ? ""
                    : format(attendanceData[0].attendance_out, "HH:mm")}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex gap-4 mt-4">
            {attendanceData.length > 0 && attendanceData[0].attendance_in ? (
              <></>
            ) : (
              <FormButton
                labelText="Check In"
                severity="success"
                onClick={() => employeeAttend(AttendanceType.InAttend)}
              />
            )}

            <FormButton
              labelText="Check Out"
              severity="danger"
              onClick={() => employeeAttend(AttendanceType.OutAttend)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTemplate;
